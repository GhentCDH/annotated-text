import { createAnnotationColors } from '@ghentcdh/annotated-text';

const colorDictionary: { [key: string]: string } = {
  '1': '#f51720',
  '2': '#008d7c',
  '3': '#ffbc05',
  '4': '#8aff05',
  '5': '#ff7ec3',
  '6': '#05d1ff',
  '7': '#6200d1',
  '8': '#424600',
  '9': '#613900',
} as const;

export const annotationColors = createAnnotationColors(colorDictionary);
