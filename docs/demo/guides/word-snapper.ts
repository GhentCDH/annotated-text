import {
  createAnnotatedText,
  TextLineAdapter,
  WordSnapper,
} from "@ghentcdh/vue-component-annotated-text";
import { greekText } from "../data";

export const wordSnapper = (id: string) => {
  createAnnotatedText(id, {
    text: TextLineAdapter(),
    annotation: {
      edit: true,
      create: true,
      snapper: new WordSnapper(),
    },
  })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};
