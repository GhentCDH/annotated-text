import { createAnnotatedText, TextLineAdapter } from "@ghentcdh/annotated-text";
import { greekText, largeGreekText } from "../data";

export const largeText = (id: string) => {
  createAnnotatedText(id, {
    text: TextLineAdapter(),
    annotation: {
      render: greekText.render,
    },
  })
    .setText(largeGreekText.text)
    .setAnnotations(largeGreekText.annotations);
};
