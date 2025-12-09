import { _textToLines } from './text_utilities';
import {
  createTextAdapter,
  createTextAdapterParams,
  Limit,
  TextAdapter,
} from '../TextAdapter';
import { type TextLine, textLineSchema } from '../../../model';
import { mapLinesToLimit, UpdateLineFn } from '../utils/mapLineToLimit';

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
  limit: Limit,
  textOffset: number,
): TextLine[] => {
  const lines = _textToLines(text, textOffset);
  const limitedLines = mapLinesToLimit(lines, limit, updateLine);

  return limitedLines;
};

/**
 * This adapter is used to parse a text that includes line numbers.
 *
 * f.e. `1.Χ[αι]ρήμ[ων] Ἀπολλωνίωι τῶι\n2.[φι]λτάτωι χαίρειν.`
 * will be parsed into an array of TextLine objects of 2 lines, in the gutter the line number will appear.
 */
export class TextLineAdapterImpl extends TextAdapter {
  name = 'TextLineAdapter';

  parse(text: string): TextLine[] {
    return textToLines(text, this.limit!, this.textOffset);
  }
}

export const TextLineAdapter = (params: createTextAdapterParams = {}) => {
  return createTextAdapter(new TextLineAdapterImpl(), params);
};
