import markdownit, { type Token } from 'markdown-it';

type Limit = {
  start: number;
  end: number;
  ignoreLines?: boolean;
};

const md = markdownit({
  html: false,
}).disable('list');

const markdownEnv = {};

/**
 * Renders a markdown string to HTML using markdown-it.
 * @param text - Raw markdown text
 * @returns The rendered HTML string
 */
export const replaceMarkdownToHtml = (text: string): string => {
  return md.render(text, markdownEnv);
};

const document = globalThis.document;

/**
 * Strips all HTML tags from a string, returning only the text content.
 * Uses a temporary DOM element to parse the HTML.
 * @param text - HTML string to strip
 * @returns Plain text content without HTML tags
 */
export const stripHtmlFromText = (text: string) => {
  const div = document?.createElement('div') ?? ({} as HTMLElement);
  div.innerHTML = text;
  return div.textContent || div.innerText || '';
};

type TokenInfo = {
  start: number;
  end: number;
  content: string;
  markup: string;
  length: number;
  openTag: boolean;
  closeTag: boolean;
};

/**
 * Recursively extracts token information from a markdown-it token tree.
 * Flattens child tokens into a list of {@link TokenInfo} objects with
 * computed positions, markup, and open/close tag flags.
 * @param token - The markdown-it token to extract info from
 * @returns Flat array of token info for each leaf token
 */
const findTokenInRange = (token: Token): TokenInfo[] => {
  if (token.children) {
    return token.children.flatMap((child) => findTokenInRange(child));
  }

  const { markup, content } = token;
  let length = content.length;
  if (token.type === 'paragraph_close') {
    length = 1;
  }
  return [
    {
      content,
      markup,
      length,
      start: 0,
      end: length,
      openTag: token.type?.includes('_open'),
      closeTag: token.type?.includes('_close'),
    } as TokenInfo,
  ];
};

/**
 * Parses a markdown-it inline token into positioned child tokens.
 * Each child gets absolute `start` and `end` character offsets
 * based on `prevStart`.
 * @param token - The inline token whose children to position
 * @param prevStart - The absolute character offset where this token begins
 * @returns Object with the token's `start`, `end`, `length`, and positioned `children`
 */
const parseLineToTokens = (token: Token, prevStart: number) => {
  let nextStart = prevStart;
  let length = 0;

  const children = token.children?.map((child) => {
    const start = nextStart;
    const end = start + child.content.length;
    length += child.content.length;
    nextStart = end;

    return {
      ...child,
      start,
      end,
    };
  });

  return {
    end: prevStart + length,
    start: prevStart,
    length,
    children,
  };
};

/**
 * Checks whether a line (or child token) overlaps with the given `[start, end]` range.
 * @param start - Range start (inclusive)
 * @param end - Range end (inclusive)
 * @param line - Object with `start` and `end` positions to test
 * @returns `true` if the line overlaps with the range
 */
const inRange = (
  start: number,
  end: number,
  line: { start: number; end: number },
) => {
  if (line.start < start && line.end < start) {
    return false;
  }
  if (line.start > end && line.end > end) {
    return false;
  }
  return true;
};

/**
 * Extracts a substring of markdown text within a character range while preserving
 * surrounding markdown markup (e.g. bold, italic tags). Parses the full text, then
 * slices only the tokens that fall within the given `limit` range.
 *
 * @param text - The full markdown text to slice
 * @param limit - The character range to extract (`start`/`end`), with optional `ignoreLines`
 *   to skip per-character slicing and keep full lines
 * @param startOffset - Optional offset added to all character positions (default `0`)
 * @returns Object containing the rendered `html`, raw `markdownText`, and the actual
 *   `start`/`end` positions of the extracted range
 */
export const getPartialMarkdownWithLimit = (
  text: string,
  limit: Limit,
  startOffset = 0,
) => {
  const parsedLines = md.parse(text, markdownEnv);
  let nextStart = startOffset;
  const markdownText: string[] = [];
  let index = 0;
  const { start, end } = limit;
  let lineStart = startOffset;
  let lineEnd = startOffset;
  let lineRangeSet = false;

  for (const parsedLine of parsedLines) {
    const line = parseLineToTokens(parsedLine, nextStart);
    if (!line.children?.length) {
      continue;
    }
    nextStart = line.end + 1;

    if (!inRange(start, end, line)) {
      continue;
    }

    for (const child of line.children) {
      if (!inRange(start, end, child)) {
        continue;
      }

      let lStart = child.start;
      let lEnd = child.end;

      if (!limit?.ignoreLines) {
        lStart = start < lStart ? lStart : start;
        lEnd = end < lEnd ? end : lEnd;
      }

      if (lStart !== child.start) {
        const prevChild = line.children[index - 1];
        if (prevChild) markdownText.push(prevChild.markup);
      }

      if (!lineRangeSet) {
        lineStart = lStart;
        lineEnd = lEnd;
        lineRangeSet = true;
      }

      lStart = lStart - line.start;
      lEnd = lEnd - line.start;

      markdownText.push(child.content.substring(lStart, lEnd));
      markdownText.push(child.markup);

      if (lEnd !== child.end) {
        const nextChild = line.children[index + 1];
        if (nextChild) markdownText.push(nextChild.markup);
      }
      index += 1;
    }
    index = 0;
  }

  const result = markdownText.join('');

  return {
    html: replaceMarkdownToHtml(result),
    markdownText: result,
    start: lineStart,
    end: lineEnd,
  };
};

/**
 * Extracts a substring of an inline markdown text within a character range while
 * preserving surrounding markdown markup. Unlike {@link getPartialMarkdownWithLimit},
 * this uses `parseInline` and works on a single inline markdown string without
 * block-level parsing.
 *
 * @param text - The inline markdown text to slice
 * @param start - Start character index (inclusive)
 * @param end - End character index (inclusive)
 * @returns Object containing the rendered `html` and the raw `text` of the extracted range
 */
export const getPartialMarkdown = (
  text: string,
  start: number,
  end: number,
) => {
  const parsedLines = md.parseInline(text, markdownEnv);

  const tokens = parsedLines.flatMap((token) => findTokenInRange(token));

  let nextStart = 0;
  const markdownText: string[] = [];
  let index = 0;

  for (const token of tokens) {
    const tokenEnd = nextStart + token.length;

    if (nextStart < start && tokenEnd < start) {
      // Out of range, skip
    } else if (nextStart < start) {
      const prevToken = tokens[index - 1];
      if (prevToken?.openTag) {
        markdownText.push(prevToken.markup);
      }
      markdownText.push(token.content.substring(start - nextStart));
    } else if (end < tokenEnd) {
      markdownText.push(token.content.substring(0, end + 1));

      const nextToken = tokens[index + 1];
      if (nextToken?.closeTag) {
        markdownText.push(nextToken.markup);
      }
      break;
    } else {
      markdownText.push([token.content, token.markup].join(''));
    }
    nextStart += token.length;
    index++;
  }

  const newText = markdownText.join('');

  return { html: replaceMarkdownToHtml(newText), text: newText };
};