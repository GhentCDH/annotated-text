import MarkdownIt from 'markdown-it';
import type Token from 'markdown-it/lib/token.mjs';

/**
 * A single mapped span between the raw markdown source and the normalized text.
 *
 * - `text`     : verbatim content present in both raw and normalized strings (1:1).
 * - `marker`   : raw-only formatting characters (`**`, `*`, `_`, backticks, leading
 *                hashes, trailing hard-break spaces, …). Contributes 0 chars to norm.
 * - `separator`: collapses one or more raw whitespace/break chars into 1 norm char
 *                (`\n` between blocks, space for softbreak inside a paragraph).
 */
export interface Segment {
  kind: 'text' | 'marker' | 'separator';
  rawStart: number;
  rawEnd: number;
  normStart: number;
  normEnd: number;
}

export interface NormalizationResult {
  /** The original markdown source. */
  source: string;
  /** The normalized plain-text representation. */
  text: string;
  /** Ordered, non-overlapping segments covering the full source range. */
  segments: Segment[];

  /** Map a normalized offset to the corresponding raw markdown offset. */
  toRawOffset(normOffset: number): number;
  /** Map a raw markdown offset to the corresponding normalized offset. */
  toNormOffset(rawOffset: number): number;
  /** Given a normalized [start, end) range, return the raw [start, end) range. */
  toRawRange(
    normStart: number,
    normEnd: number,
  ): { start: number; end: number };
  /** Reconstruct the raw markdown slice corresponding to a normalized range. */
  reconstruct(normStart: number, normEnd: number): string;
}

const DEFAULT_PARSER = new MarkdownIt({
  html: false,
  breaks: false,
  linkify: false,
});

/**
 * Normalize markdown to plain text while building a bidirectional offset map.
 *
 * Normalization rules:
 *   - Inline formatting markers (`**`, `*`, `_`, backticks, link/image syntax)
 *     are stripped; their text content is kept.
 *   - Block boundaries (paragraph breaks, headings, list items, blockquotes)
 *     collapse to a single `\n`, regardless of how many blank lines/spaces
 *     separated them in the source.
 *   - Soft line breaks within a paragraph become a single space.
 *   - Hard line breaks (`  \n`) become a single `\n`.
 *
 * @param source  Raw markdown input.
 * @param parser  Optional custom MarkdownIt instance.
 */
export function normalizeMarkdown(
  source: string,
  parser: MarkdownIt = DEFAULT_PARSER,
): NormalizationResult {
  const tokens = parser.parse(source, {});
  const lineOffsets = computeLineOffsets(source);
  const segments: Segment[] = [];

  let normCursor = 0;
  let rawCursor = 0;
  let blockIndex = 0;

  for (const token of tokens) {
    if (token.type !== 'inline' || !token.map) continue;

    const [lineStart, lineEnd] = token.map;
    const blockRawStart = lineOffsets[lineStart] ?? source.length;
    const blockRawEnd =
      lineEnd < lineOffsets.length ? lineOffsets[lineEnd] : source.length;

    // Gap before this block: either leading prefix (heading hashes, list bullets,
    // etc. on the same line) or a block separator (collapses N raw chars -> 1 norm char).
    if (blockIndex === 0) {
      // Leading raw chars before the first block (e.g. front-matter, BOM).
      if (blockRawStart > rawCursor) {
        segments.push(makeMarker(rawCursor, blockRawStart, normCursor));
      }
    } else {
      // Block separator collapses to a single `\n`.
      if (blockRawStart > rawCursor) {
        segments.push({
          kind: 'separator',
          rawStart: rawCursor,
          rawEnd: blockRawStart,
          normStart: normCursor,
          normEnd: normCursor + 1,
        });
        normCursor += 1;
      }
    }
    rawCursor = blockRawStart;

    // Walk inline children, scanning the source forward to locate each piece.
    let scanPos = blockRawStart;
    for (const child of token.children ?? []) {
      const handled = handleInlineChild(child, source, scanPos, blockRawEnd);
      if (!handled) continue;

      // Anything skipped between scanPos and the located piece is a marker
      // (e.g. `**`, `*`, leading `#`, list bullet, link `[`).
      if (handled.locatedAt > scanPos) {
        segments.push(makeMarker(scanPos, handled.locatedAt, normCursor));
      }

      segments.push({
        kind: handled.kind,
        rawStart: handled.locatedAt,
        rawEnd: handled.locatedAt + handled.rawLength,
        normStart: normCursor,
        normEnd: normCursor + handled.normLength,
      });
      normCursor += handled.normLength;
      scanPos = handled.locatedAt + handled.rawLength;
    }

    // Trailing markers within the block (rare: e.g. closing `**` at end of line).
    if (scanPos < blockRawEnd) {
      // Trim to exclude the block-trailing newline; that newline is part of the
      // next block's separator (or end-of-document).
      const trailingEnd =
        source[blockRawEnd - 1] === '\n' ? blockRawEnd - 1 : blockRawEnd;
      if (trailingEnd > scanPos) {
        segments.push(makeMarker(scanPos, trailingEnd, normCursor));
      }
      scanPos = blockRawEnd;
    }

    rawCursor = scanPos;
    blockIndex++;
  }

  // Trailing source after the last block (final newlines, etc.).
  if (rawCursor < source.length) {
    segments.push(makeMarker(rawCursor, source.length, normCursor));
  }

  const text = buildText(source, segments);
  return makeResult(source, text, segments);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

interface HandledChild {
  kind: 'text' | 'separator';
  locatedAt: number;
  rawLength: number;
  normLength: number;
}

function handleInlineChild(
  child: Token,
  source: string,
  scanPos: number,
  blockEnd: number,
): HandledChild | null {
  switch (child.type) {
    case 'text': {
      const idx = findContent(source, child.content, scanPos, blockEnd);
      if (idx === -1) return null;
      return {
        kind: 'text',
        locatedAt: idx,
        rawLength: child.content.length,
        normLength: child.content.length,
      };
    }
    case 'code_inline': {
      const idx = findContent(source, child.content, scanPos, blockEnd);
      if (idx === -1) return null;
      return {
        kind: 'text',
        locatedAt: idx,
        rawLength: child.content.length,
        normLength: child.content.length,
      };
    }
    case 'softbreak': {
      const idx = source.indexOf('\n', scanPos);
      if (idx === -1 || idx >= blockEnd) return null;
      return {
        kind: 'separator',
        locatedAt: idx,
        rawLength: 1,
        normLength: 1, // becomes a space in buildText
      };
    }
    case 'hardbreak': {
      const idx = source.indexOf('\n', scanPos);
      if (idx === -1 || idx >= blockEnd) return null;
      return {
        kind: 'separator',
        locatedAt: idx,
        rawLength: 1,
        normLength: 1, // becomes a newline in buildText
      };
    }
    default:
      // strong_open, strong_close, em_open, em_close, link_open, link_close, …
      // Their markers are picked up as gaps between text children.
      return null;
  }
}

function findContent(
  source: string,
  needle: string,
  from: number,
  end: number,
): number {
  if (needle.length === 0) return from;
  const idx = source.indexOf(needle, from);
  if (idx === -1 || idx + needle.length > end) return -1;
  return idx;
}

function makeMarker(
  rawStart: number,
  rawEnd: number,
  normPos: number,
): Segment {
  return {
    kind: 'marker',
    rawStart,
    rawEnd,
    normStart: normPos,
    normEnd: normPos,
  };
}

function computeLineOffsets(source: string): number[] {
  const offsets = [0];
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\n') offsets.push(i + 1);
  }
  return offsets;
}

function buildText(source: string, segments: Segment[]): string {
  let out = '';
  for (const seg of segments) {
    if (seg.kind === 'text') {
      out += source.slice(seg.rawStart, seg.rawEnd);
    } else if (seg.kind === 'separator' && seg.normEnd > seg.normStart) {
      const raw = source.slice(seg.rawStart, seg.rawEnd);
      // Single `\n` with no blank line → soft line break inside a paragraph → space.
      // `  \n` (hard break) or anything containing a blank line → `\n`.
      if (raw === '\n') {
        out += ' ';
      } else {
        out += '\n';
      }
    }
  }
  return out;
}

function makeResult(
  source: string,
  text: string,
  segments: Segment[],
): NormalizationResult {
  const toRawOffset = (normOffset: number): number => {
    if (normOffset <= 0) return 0;
    if (normOffset >= text.length) return source.length;

    for (const seg of segments) {
      if (
        seg.kind === 'text' &&
        normOffset >= seg.normStart &&
        normOffset <= seg.normEnd
      ) {
        return seg.rawStart + (normOffset - seg.normStart);
      }
      if (
        seg.kind === 'separator' &&
        normOffset >= seg.normStart &&
        normOffset <= seg.normEnd
      ) {
        // Map norm position within separator to its raw start (the separator collapses).
        return seg.rawStart + (normOffset - seg.normStart);
      }
    }
    return source.length;
  };

  const toNormOffset = (rawOffset: number): number => {
    if (rawOffset <= 0) return 0;
    if (rawOffset >= source.length) return text.length;

    for (const seg of segments) {
      if (rawOffset >= seg.rawStart && rawOffset < seg.rawEnd) {
        if (seg.kind === 'text') {
          return seg.normStart + (rawOffset - seg.rawStart);
        }
        // Marker or separator: snap to the segment's normStart.
        return seg.normStart;
      }
      if (rawOffset === seg.rawEnd && seg.kind === 'text') {
        return seg.normEnd;
      }
    }
    return text.length;
  };

  const toRawRange = (
    normStart: number,
    normEnd: number,
  ): { start: number; end: number } => ({
    start: toRawOffset(normStart),
    end: toRawOffset(normEnd),
  });

  const reconstruct = (normStart: number, normEnd: number): string => {
    const { start, end } = toRawRange(normStart, normEnd);
    return source.slice(start, end);
  };

  return {
    source,
    text,
    segments,
    toRawOffset,
    toNormOffset,
    toRawRange,
    reconstruct,
  };
}
