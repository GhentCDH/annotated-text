import {
  createLineAdapter,
  createLineAdapterParams,
  LineAdapter,
} from "./LineAdapter";
import { markdownRanges } from "./markdown/ranges";
import { type Line, type TextLine, textLineSchema } from "../../model";

const replaceMarkdownToHtml = (text: string): string => {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Convert bold (**text**)
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Convert italic (*text*)
  html = html.replace(/\*(?!\*)(.+?)\*/g, "<em>$1</em>");

  return html;
};

export class MarkdownTextAdapterImpl extends LineAdapter<string> {
  name = "MarkdownLineAdapter";

  parse(text: string): TextLine[] {
    const lines = text.split(/\n\s*\n/);
    let start = 0;

    const result = lines.map((text, index) => {
      // Add additional 1 because the \n symbol consist of 2 characters
      const end = start + text.length + 1;
      const line = textLineSchema.parse({
        lineNumber: index,
        start,
        end,
        id: `line-${index}`,
        text,
      }) as TextLine;

      start = end;

      return line;
    });

    return result;
  }

  getLineHtml(line: TextLine): string {
    return replaceMarkdownToHtml(line.text);
  }

  getRanges(annotation: any, line: TextLine): DOMRect[] | null {
    return markdownRanges(annotation, line);
  }
}

export const MarkdownTextAdapter = (
  params: createLineAdapterParams<Line[]> = {},
) => {
  return createLineAdapter(new MarkdownTextAdapterImpl(), params);
};
