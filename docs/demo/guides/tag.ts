import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated-text";
import { greekText } from "../data";

export const RenderTag = (id: string, enabledOnHover?: boolean) => {
  clearAnnotatedTextCache();

  createAnnotatedText(id, {
    text: TextLineAdapter(),
    annotation: {
      edit: true,
      create: true,
      defaultRender: "underline",
      tagConfig: {
        enabled: true,
        enabledOnHover,
        tagFn: (annotation) => annotation.label ?? "No label",
      },
    },
  })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};
