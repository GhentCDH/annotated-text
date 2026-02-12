import { createAnnotatedText, WordSnapper } from '@ghentcdh/annotated-text';
import { plainText } from '../data';
import { DemoAnnotationConfig } from '../data/data.types';

export const wordSnapper = (id: string) => {
  createAnnotatedText(id)
    .setAnnotationAdapter({ edit: true, create: false })
    .setRenderParams(DemoAnnotationConfig.render)
    .setStyleParams(DemoAnnotationConfig.style)
    .setSnapper(new WordSnapper())
    .setText(plainText.text)
    .setAnnotations(plainText.annotations);
};
