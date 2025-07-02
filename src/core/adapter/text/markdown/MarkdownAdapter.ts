import memoize from "memoizee";
import { replaceMarkdownToHtml, stripHtmlFromText } from "./parser";
import {
  createTextAdapter,
  createTextAdapterParams,
  Limit,
  TextAdapter,
} from "../TextAdapter";
import { type TextLine, textLineSchema } from "../../../model";
import { isIntersection } from "../../../compute/utils/intersect";

const _textToLines = memoize((text: string): TextLine[] => {
  // Split into paragraphs we do it ourself
  const lines = text?.split(`\n\n`) ?? [""];
  let start = 0;
  return lines.map((textLine, index) => {
    // Add additional 1 because the \n symbol consist of 2 characters

    const html = replaceMarkdownToHtml(textLine);
    const flatText = stripHtmlFromText(html);
    const length = flatText.length;
    const end = start + length;

    const line = textLineSchema.parse({
      lineNumber: index,
      start,
      end,
      id: `line-${index}`,
      text: text,
      html,
      flatText,
    }) as TextLine;

    start = end;

    return line;
  });
});

const mapLineToLimit = (line: TextLine, limit: Limit): TextLine => {
  if (!isIntersection(line, limit)) {
    return null;
  }

  if (!limit || !limit.ignoreLines) {
    return textLineSchema.parse(line);
  }

  const updateLine = (start: number, end: number) => {
    const s_diff = start === line.start ? 0 : start - line.start;
    const e_diff = line.end === end ? line.end : line.end - end;
    const flatText = line.flatText.substring(s_diff, e_diff);

    // FIXME: the html is not updated here, it should be updated as well

    line = textLineSchema.parse({
      ...line,
      text: flatText,
      flatText,
      html: flatText,
      start: start,
      end,
    });
  };

  if (line.start < limit.start) {
    updateLine(limit.start, line.end);
  }

  if (line.end > limit.end) {
    updateLine(line.start, limit.end);
  }

  return textLineSchema.parse(line);
};

const textToLines = (text: string, limit: Limit): TextLine[] => {
  // Calculation will be cached, but we need to ensure that the objects returned are immutable, so we create new instances of them.
  const lines = _textToLines(text);

  return lines.map((line) => mapLineToLimit(line, limit)).filter(Boolean);
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
