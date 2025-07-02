import { textToLines } from "./text_utilities";
import {
  createTextAdapter,
  createTextAdapterParams,
  TextAdapter,
} from "../TextAdapter";
import { type TextLine } from "../../../model";

/**
 * This adapter is used to parse a text that includes line numbers.
 *
 * f.e. `1.Χ[αι]ρήμ[ων] Ἀπολλωνίωι τῶι\n2.[φι]λτάτωι χαίρειν.`
 * will be parsed into an array of TextLine objects of 2 lines, in the gutter the line number will appear.
 */
export class TextLineAdapterImpl extends TextAdapter {
  name = "TextLineAdapter";

  parse(text: string): TextLine[] {
    return textToLines(text);
  }
}

export const TextLineAdapter = (params: createTextAdapterParams = {}) => {
  return createTextAdapter(new TextLineAdapterImpl(), params);
};
