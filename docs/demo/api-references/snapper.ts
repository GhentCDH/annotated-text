import {
  createAnnotatedText,
  Snapper,
  SnapperResult,
  TextAnnotation,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';
import { greekText } from '../data';

class CustomSnapper extends Snapper {
  setText(text: string, offsetStart: number) {}

  fixOffset(annotation: TextAnnotation): SnapperResult {
    const { start, end } = annotation;

    return { start, end: end - 2, modified: true };
  }
}

export const snapper = (id: string) => {
  createAnnotatedText(id, {
    text: TextLineAdapter(),
    annotation: {
      ...greekText.annotationConfig,
      edit: true,
      create: true,
    },
  })
    .setSnapper(new CustomSnapper())
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};
