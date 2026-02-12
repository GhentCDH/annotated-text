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
  createAnnotatedText(id)
    .setTextAdapter(TextLineAdapter())
    .setAnnotationAdapter({ edit: true, create: true })
    .setRenderParams(greekText.renderParams)
    .setStyleParams(greekText.styleParams)
    .setSnapper(new CustomSnapper())
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};
