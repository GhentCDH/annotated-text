import memoize from 'memoizee';
import {
  type Limit,
  TextAdapter,
  type TextAdapterParams,
  type TextLine,
  textLineSchema,
} from '@ghentcdh/annotated-text';
import { v4 as uuid4 } from 'uuid';
import {
  getPartialMarkdown,
  getPartialMarkdownWithLimit,
  replaceMarkdownToHtml,
  stripHtmlFromText,
} from './parser';
import {
  getDiff,
  mapLinesToLimit,
  type UpdateLineFn,
} from '../utils/mapLineToLimit';

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

  const { html, text: _text } = getPartialMarkdown(
    text,
    0 + startOffset,
    text.length + startOffset,
  );
  const flatText = stripHtmlFromText(html);

  const line = textLineSchema.parse({
    lineNumber: 0,
    uuid: uuid4(),
    flatText,
    html,
    start: 0,
    end: flatText.length,
    text,
  });

  const lines = [line];

  return mapLinesToLimit(lines, limit, updateLine);
};

/**
 * MarkdownTextAdapterImpl is a TextAdapter implementation that parses markdown text into TextLine objects.
 * It converts markdown to HTML and also provides the flat text representation.
 */
export class MarkdownTextAdapterImpl extends TextAdapter {
  name = 'MarkdownLineAdapter';

  parse(text: string, startOffset: number): TextLine[] {
    const fullHtml = replaceMarkdownToHtml(text);
    const fullFlatText = stripHtmlFromText(fullHtml);
    // this.flatText = fullFlatText;

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
    // console.log('diff', diff);
    // console.log('flatText', flatText);
    const line = textLineSchema.parse({
      lineNumber: 0,
      uuid: uuid4(),
      flatText,
      html: html,
      start: markdownText.start,
      end: markdownText.end,
      text: markdownText.markdownText,
    });

    return [line];
    //
    // return mapLinesToLimit([line], this.limit, updateLine);
    //
    // return textToLines(text, this.limit, startOffset);
  }
}

export const MarkdownTextAdapter = (params: TextAdapterParams = {}) => {
  return new MarkdownTextAdapterImpl(params);
};
