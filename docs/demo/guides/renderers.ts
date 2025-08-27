import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated-text";
import { greekText } from "../data";

export const RenderUnderline = (id_default: string, id_underline: string) => {
  clearAnnotatedTextCache();

  createAnnotatedText(id_default, {
    text: TextLineAdapter(),
    annotation: { edit: true, create: true },
  })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);

  createAnnotatedText(id_underline, {
    text: TextLineAdapter(),
    annotation: {
      edit: true,
      create: true,
      defaultRender: "underline",
    },
  })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};
