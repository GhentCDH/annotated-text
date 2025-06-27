import { replaceMarkdownToHtml, stripHtmlFromText } from "./parser";
import {
  createLineAdapter,
  createLineAdapterParams,
  LineAdapter,
} from "../LineAdapter";
import { type Line, type TextLine, textLineSchema } from "../../../model";

export class MarkdownTextAdapterImpl extends LineAdapter<string> {
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

export const MarkdownTextAdapter = (
  params: createLineAdapterParams<Line[]> = {},
) => {
  return createLineAdapter(new MarkdownTextAdapterImpl(), params);
};
