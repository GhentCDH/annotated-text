import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated-text";
import { greekText } from "../data";
import { DefaultRenders } from "../../../libs/core/src/lib/adapter/annotation/DefaultAnnotationRender";

export const RenderTag = (
  id: string,
  enabledOnHover: boolean,
  defaultRender: DefaultRenders,
) => {
  clearAnnotatedTextCache();

  createAnnotatedText(id, {
    text: TextLineAdapter(),
    annotation: {
      edit: true,
      create: true,
      defaultRender,
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
