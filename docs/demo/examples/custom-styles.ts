import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  createAnnotationColor,
} from '@ghentcdh/annotated-text';
import { type DemoAnnotation } from '../data/data.types';

const annotations = [
  {
    start: 0,
    end: 200,
    target: 'gutter',
    color: '',
    id: 'p1',
    style: 'style-gutter',
  },
  {
    start: 65,
    end: 68,
    target: 'underline',
    style: 'style-red',
    id: 'red',
  },
  {
    start: 109,
    end: 114,
    target: 'highlight',
    style: 'style-green',
    id: 'green',
  },
] as DemoAnnotation[];

const text = `This is an example text with custom styles.
The first line has a red annotation color.
The second line has a green annotation color.`;

export const customStyles = (id: string) => {
  clearAnnotatedTextCache();
  createAnnotatedText<DemoAnnotation>(id)
    .setRenderParams({
      renderFn: (annotation) => annotation.target,
    })
    .setStyleParams({
      styleFn: (annotation) => annotation.style,
    })
    .setTagLabelFn((a) => a.id)
    .registerStyle('style-red', {
      color: createAnnotationColor('#ff3b3b'),
    })
    .registerStyles({
      'style-green': {
        color: createAnnotationColor('#8bc34a'),
      },
      'style-gutter': {
        color: createAnnotationColor('#4a70c3'),
      },
    })
    .setText(text)
    .setAnnotations(annotations);
};
