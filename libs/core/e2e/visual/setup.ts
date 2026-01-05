// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';
import { DefaultRenders } from '../../src';

// Clear any cached instances
clearAnnotatedTextCache();
const mainDivId = 'demo-container';

const text = `1. Hello world. This is a simple text example.
2. This text has some annotations.`;
const renderDifferentLineHeight = (
  lineOffset: number,
  defaultRender: string,
) => {
  const id = `demo-${Date.now()}-${defaultRender}-${lineOffset}`;
  const mainDiv = document.getElementById(mainDivId);
  const demo = document.createElement('div');
  demo.id = id;
  const titleDiv = document.createElement('h2');
  titleDiv.textContent = `Line height: ${lineOffset}px - ${defaultRender}`;
  mainDiv.append(titleDiv);
  mainDiv.append(demo);

  // Basic text setup
  createAnnotatedText(id, {
    text: TextLineAdapter({
      style: {
        lineOffset,
      },
    }),
    annotation: {
      render: {
        renderFn: (a: any) => a.renderer ?? defaultRender,
      },
    },
  })
    .setText(text)
    .setAnnotations([
      { id: '1', start: 0, end: 8 },
      { id: '2', start: 9, end: 15 },
      { id: '3', start: 38, end: 59 },
      { id: '4', start: 0, end: 60, renderer: DefaultRenders.gutter },
    ] as any);
};

renderDifferentLineHeight(2, DefaultRenders.underline);
renderDifferentLineHeight(30, DefaultRenders.underline);
renderDifferentLineHeight(2, DefaultRenders.highlight);
renderDifferentLineHeight(10, DefaultRenders.highlight);
renderDifferentLineHeight(30, DefaultRenders.highlight);
