import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated-text";
import { greekText } from "../data";

export const RenderTag = (
  id: string,
  enabledOnHover: boolean,
  defaultRenderer: string,
) => {
  clearAnnotatedTextCache();

  createAnnotatedText(id, {
    text: TextLineAdapter(),
    annotation: {
      edit: true,
      create: true,
      render: { defaultRenderer, renderFn: greekText.render.renderFn },
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
