import {
  type Limit,
  TextAdapter,
  type TextAdapterParams,
  type TextLine,
  textLineSchema,
} from '@ghentcdh/annotated-text';
import { v4 as uuid4 } from 'uuid';
import {
  getPartialMarkdownWithLimit,
  replaceMarkdownToHtml,
  stripHtmlFromText,
} from './parser';
import memoize from 'memoizee';

/**
 * Computes the clamped start offset of a limit within a line.
 * Returns `0` if the limit starts before or at the line start,
 * otherwise returns the relative offset from the line start.
 */
const getStart = memoize((lineStart: number, limitStart: number) => {
  if (limitStart <= lineStart) return 0;
  return limitStart - lineStart;
});

/**
 * Computes the clamped end offset of a limit within a line.
 * Returns the full line length if the line ends within the limit,
 * otherwise returns the relative offset of the limit end from the line start.
 */
const getEnd = memoize(
  (lineStart: number, lineEnd: number, limitEnd: number) => {
    if (lineEnd <= limitEnd) return lineEnd - lineStart;
    return limitEnd - lineStart;
  },
);
/**
 * Calculates the relative `start` and `end` offsets for a line
 * clamped to the given limit range.
 *
 * @param line - The line with absolute `start` and `end` positions
 * @param limit - The limit range to clamp to (must be non-null)
 * @returns Relative `start` and `end` offsets within the line
 */
export const getDiff = (
  line: Pick<TextLine, 'start' | 'end'>,
  limit: NonNullable<Limit>,
) => {
  const start = getStart(line.start, limit.start);
  const end = getEnd(line.start, line.end, limit.end);

  return { start, end };
};

/**
 * {@link TextAdapter} implementation that parses markdown text into {@link TextLine} objects.
 * Converts markdown to HTML and provides a flat (plain text) representation.
 * Supports optional limit-based slicing to extract a character range while
 * preserving markdown markup.
 */
export class MarkdownTextAdapterImpl extends TextAdapter {
  name = 'MarkdownLineAdapter';

  /**
   * Parses the given markdown text into a single {@link TextLine}.
   *
   * When a `limit` is set on the adapter, only the portion of text within
   * that range is extracted (with markdown tags preserved). Otherwise the
   * full text is converted.
   *
   * @param text - Raw markdown text to parse
   * @param startOffset - Absolute character offset for position calculations
   * @returns Object with the parsed `lines` array, `flatText`, and `html`
   */
  _parse(text: string, startOffset: number) {
    const fullHtml = replaceMarkdownToHtml(text);
    const fullFlatText = stripHtmlFromText(fullHtml);
    this.fullFlatText = fullFlatText;

    const textDim = { start: startOffset, end: text.length + startOffset };
    const diff = this.limit ? getDiff(textDim, this.limit) : textDim;

    const markdownText = this.limit
      ? getPartialMarkdownWithLimit(
          text,
          { ...diff, ignoreLines: this.limit.ignoreLines },
          startOffset,
        )
      : {
          start: 0,
          end: text.length,
          html: fullHtml,
          markdownText: text,
        };
    const flatText = this.limit
      ? fullFlatText.substring(markdownText.start, markdownText.end)
      : fullFlatText;
    const html = this.limit ? markdownText.html : fullHtml;
    const line = textLineSchema.parse({
      lineNumber: 0,
      uuid: uuid4(),
      flatText,
      html,
      start: markdownText.start,
      end: markdownText.end,
      text: markdownText.markdownText,
    });

    return { lines: [line], flatText, html };
  }
}

/**
 * Factory function that creates a new {@link MarkdownTextAdapterImpl} instance.
 *
 * @param params - Optional adapter configuration (limit, text direction, style, etc.)
 * @returns A configured {@link MarkdownTextAdapterImpl}
 */
export const MarkdownTextAdapter = (params: TextAdapterParams = {}) => {
  return new MarkdownTextAdapterImpl(params);
};
