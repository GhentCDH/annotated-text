// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
} from '@ghentcdh/annotated-text';
import { renderProblemIds, type RenderProblemKeys } from './testIds';
import { renderDemoDiv } from '../_utils/render-demo';
import { DefaultRenders } from '../../src';

const text = `The quick brown fox jumps over the lazy dog.
the second line`;

const annotations = [
  {
    id: `1_${Date.now()}`,
    start: 4,
    end: 9,
    label: 'adjective',
    color: '#fbbf24',
  },
  {
    id: `2_${Date.now()}`,
    start: 10,
    end: 15,
    label: 'adjective',
    color: '#34d399',
  },
  {
    id: `3_${Date.now()}`,
    start: 16,
    end: 19,
    label: 'noun',
    color: '#60a5fa',
  },
  {
    id: `4_${Date.now()}`,
    start: 1,
    end: 19,
    label: 'noun',
    color: '#60a5fa',
    renderer: 'gutter',
  },
];

const renderDemo = (
  _id: RenderProblemKeys,
  title: string,
  scaled: number | null = null,
  renderer: string = DefaultRenders.highlight,
) => {
  const id = renderProblemIds[_id];
  // Clear any cached instances
  clearAnnotatedTextCache();

  renderDemoDiv(title, id);

  if (scaled) {
    document.getElementById(id)!.style.transform = `scale(${scaled})`;
  }

  // Basic text setup
  createAnnotatedText<any>(id)
    .setAnnotationAdapter({ edit: true, create: true })
    .setRenderParams({ renderFn: (a) => a.renderer ?? renderer })
    .setStyleParams({
      styleFn: (a: any) => ({
        default: {
          backgroundColor: a.color,
          borderColor: a.color,
          tagBackgroundColor: a.color,
        },
      }),
    })
    .updateRenderStyle('highlight', { default: { borderRadius: 0.1 } })
    .setText(text)
    .setAnnotations(annotations);
};

renderDemo('default', 'Default');
renderDemo('underline_default', 'Default', null, DefaultRenders.underline);
renderDemo('scaled_1_5', 'Scaled 1.5', 2);
renderDemo('underline_scaled_1_5', 'Scaled 1.5', 1.5, DefaultRenders.underline);
renderDemo('scaled_0_75', 'Scaled 0.75', 0.75);
renderDemo(
  'underline_scaled_0_75',
  'Scaled 0.75',
  0.75,
  DefaultRenders.underline,
);
