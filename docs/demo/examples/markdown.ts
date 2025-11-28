import {
  createAnnotatedText,
  MarkdownTextAdapter,
} from "@ghentcdh/annotated-text";
import { markdown1 } from "../data/markdown-1";
import { DemoAnnotationConfig } from "../data/data.types";

export const markdown_1 = (
  id: string,
  { start, end } = { start: 0, end: 423 },
) => {
  createAnnotatedText(id, {
    annotation: DemoAnnotationConfig,
    text: MarkdownTextAdapter({
      limit: { start, end, ignoreLines: true },
    }),
  }).setText(markdown1.text);
};
