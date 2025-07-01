import {
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/vue-component-annotated-text";
import { waitUntilElementExists } from "../waitUntilElementExists";
import { largeGreekText } from "../data";

export const largeText = (id: string) => {
  waitUntilElementExists(id).then((element) => {
    createAnnotatedText(id, {
      text: TextLineAdapter(),
    })
      .setText(largeGreekText.text)
      .setAnnotations(largeGreekText.annotations);
  });
};
