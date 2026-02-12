/* eslint-disable no-console */
import { createAnnotatedText, TextLineAdapter, WordSnapper } from '@ghentcdh/annotated-text';
import { annotationColors } from '../data/const';
import { type DemoAnnotation, DemoAnnotationConfig } from '../data/data.types';

const annotations = [
  {
    start: 10,
    end: 29,
    label: 'Subject phrase',
    color: annotationColors['2'],
    id: 'anno1',
  },
  {
    start: 30,
    end: 53,
    label: 'Action and object',
    color: annotationColors['3'],
    id: 'anno2',
  },
] as DemoAnnotation[];

const text =
  'The quick brown fox jumps over the lazy dog near the riverbank at dawn.';

export const createDifferentTextOffset = (id: string, startOffset: number) => {
  createAnnotatedText(id)
    .setAnnotationAdapter({ edit: true, create: false, startOffset })
    .setRenderParams(DemoAnnotationConfig.render)
    .setStyleParams(DemoAnnotationConfig.style)
    .setTagLabelFn((annotation) => annotation.label)
    .setText(text)
    .setAnnotations(annotations);

  return annotations;
};

export const createDifferentTextOffsetWordsnapper = (
  id: string,
  startOffset: number,
) => {
  createAnnotatedText(id)
    .setTextAdapter(TextLineAdapter())
    .setAnnotationAdapter({ edit: true, create: false, startOffset })
    .setRenderParams(DemoAnnotationConfig.render)
    .setStyleParams(DemoAnnotationConfig.style)
    .setSnapper(new WordSnapper())
    .setTagLabelFn((annotation) => annotation.label)
    .setText(text)
    .setAnnotations(annotations);

  return annotations;
};

export const createDifferentTextOffsetLines = (
  id: string,
  startOffset: number,
) => {
  createAnnotatedText(id)
    .setTextAdapter(TextLineAdapter())
    .setAnnotationAdapter({ startOffset })
    .setRenderParams(DemoAnnotationConfig.render)
    .setStyleParams(DemoAnnotationConfig.style)
    .setTagLabelFn((annotation) => annotation.label)
    .setText(text)
    .setAnnotations(annotations);
};
