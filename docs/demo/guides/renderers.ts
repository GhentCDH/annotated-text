import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';
import { greekText } from '../data';

export const RenderUnderline = (id_default: string, id_underline: string) => {
  clearAnnotatedTextCache();

  createAnnotatedText(id_default)
    .setTextAdapter(TextLineAdapter())
    .setAnnotationAdapter({ edit: true, create: true })
    .setRenderParams(greekText.renderParams)
    .setStyleParams(greekText.styleParams)
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);

  createAnnotatedText(id_underline)
    .setTextAdapter(TextLineAdapter())
    .setAnnotationAdapter({ edit: true, create: true })
    .setRenderParams({
      defaultRenderer: 'underline',
      renderFn: greekText.renderParams.renderFn,
    })
    .setStyleParams(greekText.styleParams)
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};
