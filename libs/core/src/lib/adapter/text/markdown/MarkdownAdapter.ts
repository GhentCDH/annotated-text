import memoize from 'memoizee';
import {
  getPartialMarkdown,
  replaceMarkdownToHtml,
  stripHtmlFromText,
} from './parser';
import {
  type Limit,
  TextAdapter,
  type TextAdapterParams,
} from '../TextAdapter';
import { type TextLine, textLineSchema } from '../../../model';
import { mapLinesToLimit, type UpdateLineFn } from '../utils/mapLineToLimit';

const _textToLines = memoize(
  (text: string, startOffset: number): TextLine[] => {
    // Split into paragraphs we do it ourself
    const lines = text?.split('\n\n') ?? [''];
    let start = startOffset;
    return lines.map((textLine, index) => {
      const html = replaceMarkdownToHtml(textLine);
      const flatText = stripHtmlFromText(html);

      // Add 1 to account for the newline separator that was removed by split('\n\n')
      const end = start + textLine.length + 1;

      const line = textLineSchema.parse({
        lineNumber: index,
        start,
        end,
        id: `line-${index}`,
        text: textLine,
        html,
        flatText,
      }) as TextLine;

      start = end;

      return line;
    });
  },
);

const updateLine: UpdateLineFn = (
  line: TextLine,
  start: number,
  end: number,
  diff: { start: number; end: number },
): TextLine => {
  const flatText = line.flatText.substring(diff.start, diff.end);

  const { html, text } = getPartialMarkdown(line.text, diff.start, diff.end);
  return textLineSchema.parse({
    ...line,
    text,
    flatText,
    html,
    start: start,
    end,
  });
};

const textToLines = (
  text: string,
  limit: Limit,
  startOffset: number,
): TextLine[] => {
  // Calculation will be cached, but we need to ensure that the objects returned are immutable, so we create new instances of them.
  const lines = _textToLines(text, startOffset);
  return mapLinesToLimit(lines, limit, updateLine);
};

/**
 * MarkdownTextAdapterImpl is a TextAdapter implementation that parses markdown text into TextLine objects.
 * It converts markdown to HTML and also provides the flat text representation.
 */
export class MarkdownTextAdapterImpl extends TextAdapter {
  name = 'MarkdownLineAdapter';

  parse(text: string, startOffset: number): TextLine[] {
    return textToLines(text, this.limit, startOffset);
  }
}

export const MarkdownTextAdapter = (params: TextAdapterParams = {}) => {
  return new MarkdownTextAdapterImpl(params);
};
