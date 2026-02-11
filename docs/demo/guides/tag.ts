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

  createAnnotatedText(id)
    .setTextAdapter(TextLineAdapter())
    .setAnnotationAdapter({ edit: true, create: true })
    .setRenderParams({
      defaultRenderer,
      renderFn: greekText.renderParams.renderFn,
    })
    .setStyleParams(greekText.styleParams)
    .setTagLabelFn((annotation) => annotation.label ?? 'No label')
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};
