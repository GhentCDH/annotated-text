import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';
import { greekText } from '../data';

export const RenderUnderline = (id_default: string, id_underline: string) => {
  clearAnnotatedTextCache();

  createAnnotatedText(id_default, { textAdapter: TextLineAdapter() })
    .setAnnotationAdapterParams({ edit: true, create: true })
    .setRenderParams(greekText.renderParams)
    .setStyleParams(greekText.styleParams)
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);

  createAnnotatedText(id_underline, { textAdapter: TextLineAdapter() })
    .setAnnotationAdapterParams({ edit: true, create: true })
    .setRenderParams({
      defaultRenderer: 'underline',
      renderFn: greekText.renderParams.renderFn,
    })
    .setStyleParams(greekText.styleParams)
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};
