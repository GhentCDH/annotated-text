import {
  createAnnotatedText,
  MarkdownTextAdapter,
} from "@ghentcdh/vue-component-annotated-text";
import { waitUntilElementExists } from "../waitUntilElementExists";
import { markdown1 } from "../data/markdown-1";

export const markdown_1 = (id: string) => {
  waitUntilElementExists(id).then((element) => {
    createAnnotatedText(id, {
      text: MarkdownTextAdapter({
        limit: { start: 0, end: 423, ignoreLines: true },
      }),
    }).setText(markdown1.text);
    // .setAnnotations(greekText.annotationsWithGutters);
  });
};
