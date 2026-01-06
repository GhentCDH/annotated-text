// Import styles directly (not through index.ts to avoid Istanbul/Babel issues)
import '../../src/lib/style/style.scss';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { clearAnnotatedTextCache, createAnnotatedText } from '@ghentcdh/annotated-text';
import { renderProblemIds, type RenderProblemKeys } from './testIds';
import { renderDemoDiv } from '../_utils/render-demo';
import { createAnnotationColor } from '../../src';

const text = 'The quick brown fox jumps over the lazy dog.';

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
];

const renderDemo = (
  _id: RenderProblemKeys,
  title: string,
  scaled: number | null = null,
  _annotations = annotations,
) => {
  const id = renderProblemIds[_id];
  // Clear any cached instances
  clearAnnotatedTextCache();

  renderDemoDiv(title, id);

  if (scaled) {
    document.getElementById(id)!.style.transform = `scale(${scaled})`;
  }

  // Basic text setup
  return createAnnotatedText(id, {
    annotation: {
      style: {
        styleFn: (a: any) => ({
          color: createAnnotationColor(a.color),
        }),
      },
    },
  })
    .updateRenderStyle('highlight', { borderRadius: 0.1 })
    .setText(text)
    .setAnnotations(_annotations);
};

renderDemo('default', 'Default');
renderDemo('scaled_1_5', 'Scaled 1.5', 1.5);
renderDemo('scaled_0_75', 'Scaled 0.75', 0.75);
