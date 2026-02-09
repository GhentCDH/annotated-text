import { createAnnotatedText, WordSnapper } from '@ghentcdh/annotated-text';
import { plainText } from '../data';
import { DemoAnnotationConfig } from '../data/data.types';

export const wordSnapper = (id: string) => {
  createAnnotatedText(id, {
    // text: TextLineAdapter(),
    annotation: {
      ...DemoAnnotationConfig,
      edit: true,
      create: true,
    },
  })
    .setSnapper(new WordSnapper())
    .setText(plainText.text)
    .setAnnotations(plainText.annotations);
};
