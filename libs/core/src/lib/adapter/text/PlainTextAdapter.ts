import memoize from 'memoizee';
import {
  createTextAdapter,
  type createTextAdapterParams,
  type Limit,
  TextAdapter,
} from './TextAdapter';
import { mapLinesToLimit, type UpdateLineFn } from './utils/mapLineToLimit';
import { type TextLine, textLineSchema } from '../../model';

const _textToLines = memoize(
  (text: string, startOffset: number): TextLine[] => {
    const lines = text?.split('\n') ?? [''];
    let start = startOffset;

    return lines.map((textLine, index) => {
      // Add additional 1 because the \n symbol consist of 2 characters
      const end = start + textLine.length + 1;
      const line = textLineSchema.parse({
        lineNumber: index,
        start,
        end,
        id: `line-${index}`,
        text: textLine,
        html: `${textLine}`,
        flatText: textLine,
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
  return textLineSchema.parse({
    ...line,
    text: flatText,
    flatText,
    html: flatText,
    start: start,
    end,
  });
};

const textToLines = (
  text: string,
  limit: Limit | null,
  startOffset: number,
): TextLine[] => {
  // Calculation will be cached, but we need to ensure that the objects returned are immutable, so we create new instances of them.
  const lines = _textToLines(text, startOffset);
  return mapLinesToLimit(lines, limit, updateLine);
};

/***
 * PlainTextAdapterImpl is a simple implementation of TextAdapter that parses plain text into TextLine objects.
 * It does not handle any special formatting or annotations, just plain text lines.
 */
export class PlainTextAdapterImpl extends TextAdapter {
  name = 'PlainTextAdapter';

  parse(text: string): TextLine[] {
    return textToLines(text, this.limit, this.annotationAdapter.startOffset);
  }
}

export const PlainTextAdapter = (params: createTextAdapterParams = {}) => {
  return createTextAdapter(new PlainTextAdapterImpl(), params);
};
