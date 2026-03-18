import { createAnnotatedText } from '@ghentcdh/annotated-text';
import { MarkdownTextAdapter } from '@ghentcdh/annotated-text--markdown';
import { markdown1 } from '../data/markdown-1';
import { DemoAnnotationConfig } from '../data/data.types';

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
