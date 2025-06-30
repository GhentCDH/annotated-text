import { replaceMarkdownToHtml, stripHtmlFromText } from "./parser";
import {
  createLineAdapter,
  createTextAdapterParams,
  TextAdapter,
} from "../TextAdapter";
import { type TextLine, textLineSchema } from "../../../model";

export class MarkdownTextAdapterImpl extends TextAdapter {
  name = "MarkdownLineAdapter";

  parse(text: string): TextLine[] {
    const html = replaceMarkdownToHtml(text);
    const flatText = stripHtmlFromText(html);
    const length = flatText.length;
    return [
      textLineSchema.parse({
        lineNumber: 0,
        start: 0,
        end: length,
        id: `line-0`,
        text: text,
        html,
        flatText,
      }),
    ];
  }
}

export const MarkdownTextAdapter = (params: createTextAdapterParams = {}) => {
  return createLineAdapter(new MarkdownTextAdapterImpl(), params);
};
