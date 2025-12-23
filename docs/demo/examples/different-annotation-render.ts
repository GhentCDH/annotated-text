import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  UnderLineAnnotationRender,
} from '@ghentcdh/annotated-text';
import { annotationColors } from '../data/const';
import { DemoAnnotationConfig } from '../data/data.types';

const annotations = [
  {
    start: 2,
    end: 3,
    color: annotationColors['2'],
    target: 'text',
    label: 'gts',
    id: '1',
  },
  {
    start: 24,
    end: 27,
    color: annotationColors['3'],
    target: 'text',
    label: 'gts',
    id: '2',
  },
  {
    start: 55,
    end: 64,
    color: annotationColors['4'],
    target: 'text',
    label: 'gts',
    id: '3',
  },
];

const text = `1 character selection
3 character selection with
Emoji 😀 test 🎉 content
`;

export const createDifferentAnnotationRenders = (
  id_default: string,
  id_underline: string,
  id_underline_thick: string,
  id_underline_thin: string,
) => {
  clearAnnotatedTextCache();
  const activeAnnotations = [];
  const selectedAnnotations = [];

  createAnnotatedText(id_default, {
    annotation: {
      style: DemoAnnotationConfig.style,
      edit: true,
      create: true,
    },
  })
    .setText(text)
    .setAnnotations(annotations);

  createAnnotatedText(id_underline, {
    annotation: {
      style: DemoAnnotationConfig.style,
      render: { defaultRenderer: 'underline' },
      edit: true,
      create: true,
    },
  })
    .setText(text)
    .setAnnotations(annotations);

  createAnnotatedText(id_underline_thin, {
    annotation: {
      style: DemoAnnotationConfig.style,
      render: { defaultRenderer: 'thin' },
      edit: true,
      create: true,
    },
  })
    .registerRender(new UnderLineAnnotationRender('thin', { borderWidth: 1 }))

    .setText(text)
    .setAnnotations(annotations);

  createAnnotatedText(id_underline_thick, {
    annotation: {
      style: DemoAnnotationConfig.style,
      edit: true,
      create: true,
      render: { defaultRenderer: 'thick' },
    },
  })
    .registerRender(new UnderLineAnnotationRender('thick', { borderWidth: 5 }))
    .setText(text)
    .setAnnotations(annotations);
};
