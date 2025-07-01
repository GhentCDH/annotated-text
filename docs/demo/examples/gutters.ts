import {
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/vue-component-annotated-text";
import { waitUntilElementExists } from "../waitUntilElementExists";
import { greekText } from "../data";

export const gutters = (id: string) => {
  waitUntilElementExists(id).then((element) => {
    createAnnotatedText(id, {
      text: TextLineAdapter(),
    })
      .setText(greekText.text)
      .setAnnotations(greekText.annotationsWithGutters);
  });
};
