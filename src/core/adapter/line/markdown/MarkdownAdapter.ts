import memoize from "memoizee";
import { replaceMarkdownToHtml, stripHtmlFromText } from "./parser";
import {
  createLineAdapter,
  createTextAdapterParams,
  TextAdapter,
} from "../TextAdapter";
import { type TextLine, textLineSchema } from "../../../model";

const _textToLines = memoize((text: string): TextLine[] => {
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
});

export const textToLines = (text: string): TextLine[] => {
  // Calculation will be cached, but we need to ensure that the objects returned are immutable, so we create new instances of them.
  return _textToLines(text).map((line) => textLineSchema.parse(line));
};

/**
 * MarkdownTextAdapterImpl is a TextAdapter implementation that parses markdown text into TextLine objects.
 * It converts markdown to HTML and also provides the flat text representation.
 */
export class MarkdownTextAdapterImpl extends TextAdapter {
  name = "MarkdownLineAdapter";

  parse(text: string): TextLine[] {
    return textToLines(text);
  }
}

export const MarkdownTextAdapter = (params: createTextAdapterParams = {}) => {
  return createLineAdapter(new MarkdownTextAdapterImpl(), params);
};
