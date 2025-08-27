import { createAnnotatedText, TextLineAdapter } from "@ghentcdh/annotated-text";
import { largeGreekText } from "../data";

export const largeText = (id: string) => {
  createAnnotatedText(id, {
    text: TextLineAdapter(),
  })
    .setText(largeGreekText.text)
    .setAnnotations(largeGreekText.annotations);
};
