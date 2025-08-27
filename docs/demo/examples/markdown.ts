import {
  createAnnotatedText,
  MarkdownTextAdapter,
} from "@ghentcdh/annotated-text";
import { markdown1 } from "../data/markdown-1";

export const markdown_1 = (
  id: string,
  { start, end } = { start: 0, end: 423 },
) => {
  createAnnotatedText(id, {
    text: MarkdownTextAdapter({
      limit: { start, end, ignoreLines: true },
    }),
  }).setText(markdown1.text);
};
