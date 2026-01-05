// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  type Limit,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';

// Clear any cached instances
clearAnnotatedTextCache();
const mainDivId = 'demo-container';

const text = `1. Hello world. This is a simple text example.
2. This text has some annotations.
3. Some more lines`;

export const exampleKeys: string[] = [];

const annotations = [
  { id: '1', start: 0, end: 8 },
  { id: '2', start: 9, end: 15 },
  { id: '3', start: 38, end: 59 },
  { id: '4', start: 90, end: 94 },
];

const renderDemo = (
  title: string,
  id: string,
  limit: Limit | undefined,
  _annotations = annotations,
) => {
  const mainDiv = document.getElementById(mainDivId);
  const demo = document.createElement('div');

  const contentdiv = document.createElement('div');
  contentdiv.id = id;
  exampleKeys.push(id);
  const titleDiv = document.createElement('h4');
  titleDiv.textContent = `Limit: ${title} `;
  demo.append(titleDiv);
  demo.append(contentdiv);
  mainDiv.append(demo);

  // Basic text setup
  return createAnnotatedText(id, {
    text: TextLineAdapter({
      limit,
    }),
  })
    .setText(text)
    .setAnnotations(_annotations);
};

renderDemo('Show everything', 'No limit', undefined);
const limitAfterInit = renderDemo(
  'Limit after initial init [10-30]',
  'limit-after-init',
  undefined,
);
limitAfterInit.changeTextAdapterConfig('limit', { start: 10, end: 30 });
const limitAfterIgnoreLinesInit = renderDemo(
  'Limit after initial init - ignore lines init [10-30]',
  'limit-after-init-ignore-lines',
  undefined,
);
limitAfterIgnoreLinesInit.changeTextAdapterConfig('limit', {
  start: 10,
  end: 30,
  ignoreLines: true,
});

annotations.forEach((a) => {
  renderDemo(
    `Single annotation - [${a.start} - ${a.end}]`,
    `no-ignore-lines-${a.id}`,
    {
      start: a.start,
      end: a.end,
      ignoreLines: false,
    },
    [a],
  );
});

annotations.forEach((a) => {
  renderDemo(
    `Single annotation - Ignore lines [${a.start} - ${a.end}]`,
    `ignore-lines-${a.id}`,
    {
      start: a.start,
      end: a.end,
      ignoreLines: true,
    },
    [a],
  );
});
