import { createAnnotatedText, WordSnapper } from "@ghentcdh/annotated_text";
import { plainText } from "../data";

export const wordSnapper = (id: string) => {
  createAnnotatedText(id, {
    // text: TextLineAdapter(),
    annotation: {
      edit: true,
      create: true,
      snapper: new WordSnapper(),
    },
  })
    .setText(plainText.text)
    .setAnnotations(plainText.annotations);
};
