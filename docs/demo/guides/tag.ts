import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';
import { greekText } from '../data';

export const RenderTag = (
  id: string,
  enabledOnHover: boolean,
  defaultRenderer: string,
) => {
  clearAnnotatedTextCache();

  createAnnotatedText(id, {
    text: TextLineAdapter(),
    annotation: {
      ...greekText.annotationConfig,
      edit: true,
      create: true,
      render: {
        defaultRenderer,
        renderFn: greekText.annotationConfig.render.renderFn,
      },
    },
  })
    .setTagLabelFn((annotation) => annotation.label ?? 'No label')
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};
