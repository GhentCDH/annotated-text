import memoize from 'memoizee';
import {
  getPartialMarkdown,
  replaceMarkdownToHtml,
  stripHtmlFromText,
} from './parser';
import {
  createTextAdapter,
  type createTextAdapterParams,
  type Limit,
  TextAdapter,
} from '../TextAdapter';
import { type TextLine, textLineSchema } from '../../../model';
import { mapLinesToLimit, type UpdateLineFn } from '../utils/mapLineToLimit';

const _textToLines = memoize((text: string, textOffset: number): TextLine[] => {
  // Split into paragraphs we do it ourself
  const lines = text?.split('\n\n') ?? [''];
  let start = textOffset;
  return lines.map((textLine, index) => {
    const html = replaceMarkdownToHtml(textLine);
    const flatText = stripHtmlFromText(html);

    // Add additional 1 because the \n symbol consist of 2 characters
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
});

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
  textOffset: number,
): TextLine[] => {
  // Calculation will be cached, but we need to ensure that the objects returned are immutable, so we create new instances of them.
  const lines = _textToLines(text, textOffset);
  return mapLinesToLimit(lines, limit, updateLine);
};

/**
 * MarkdownTextAdapterImpl is a TextAdapter implementation that parses markdown text into TextLine objects.
 * It converts markdown to HTML and also provides the flat text representation.
 */
export class MarkdownTextAdapterImpl extends TextAdapter {
  name = 'MarkdownLineAdapter';

  parse(text: string): TextLine[] {
    return textToLines(text, this.limit!, this.textOffset);
  }
}

export const MarkdownTextAdapter = (params: createTextAdapterParams = {}) => {
  return createTextAdapter(new MarkdownTextAdapterImpl(), params);
};
