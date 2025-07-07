import memoize from "memoizee";
import {
  getPartialMarkdown,
  replaceMarkdownToHtml,
  stripHtmlFromText,
} from "./parser";
import {
  createTextAdapter,
  createTextAdapterParams,
  type Limit,
  TextAdapter,
} from "../TextAdapter";
import { type TextLine, textLineSchema } from "../../../model";
import { mapLineToLimit, UpdateLineFn } from "../utils/mapLineToLimit";

const _textToLines = memoize((text: string): TextLine[] => {
  // Split into paragraphs we do it ourself
  const lines = text?.split(`\n\n`) ?? [""];
  let start = 0;
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
  isStart: boolean = true,
): TextLine => {
  const s_diff = isStart ? start - line.start : 0;
  let e_diff = line.end;

  if (start !== 0 && !isStart) {
    e_diff = line.end - end;
  }
  const flatText = line.flatText.substring(s_diff, e_diff);

  const { html, text } = getPartialMarkdown(line.text, s_diff, e_diff);
  return textLineSchema.parse({
    ...line,
    text,
    flatText,
    html,
    start: start,
    end,
  });
};

const textToLines = (text: string, limit: Limit): TextLine[] => {
  // Calculation will be cached, but we need to ensure that the objects returned are immutable, so we create new instances of them.
  const lines = _textToLines(text);
  const result = lines
    .map((line) => mapLineToLimit(line, limit, updateLine))
    .filter(Boolean);

  return result;
};

/**
 * MarkdownTextAdapterImpl is a TextAdapter implementation that parses markdown text into TextLine objects.
 * It converts markdown to HTML and also provides the flat text representation.
 */
export class MarkdownTextAdapterImpl extends TextAdapter {
  name = "MarkdownLineAdapter";

  parse(text: string): TextLine[] {
    return textToLines(text, this.limit);
  }
}

export const MarkdownTextAdapter = (params: createTextAdapterParams = {}) => {
  return createTextAdapter(new MarkdownTextAdapterImpl(), params);
};
