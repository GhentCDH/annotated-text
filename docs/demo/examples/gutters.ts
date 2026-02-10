import { createAnnotatedText, TextLineAdapter } from '@ghentcdh/annotated-text';
import { greekText } from '../data';
import { DemoAnnotationConfig } from '../data/data.types';

export const gutters = (id: string) => {
  createAnnotatedText(id, {
    text: TextLineAdapter(),
  })
    .setStyleParams(DemoAnnotationConfig.style)
    .setRenderParams({ defaultRenderer: 'gutter' })
    .setText(greekText.text)
    .setAnnotations(greekText.annotationsWithGutters);
};
