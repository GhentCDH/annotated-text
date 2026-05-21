// eslint-disable-next-line @nx/enforce-module-boundaries
import { clearAnnotatedTextCache, createAnnotatedText, type Limit, TextLineAdapter } from '@ghentcdh/annotated-text';
import { annotations, type LimitIdKeys, text } from './testIds';
import { renderDemoDiv } from '../_utils/render-demo';
import { MarkdownLimit } from './markdown.data';
import { MarkdownTextAdapter } from '../../libs/markdown/src';
import { W3CAnnotationAdapter } from '../../libs/core/src';

const renderDemo = (
  title: string,
  _id: LimitIdKeys,
  limit: Limit | undefined,
  _annotations = annotations,
) => {
  // Clear any cached instances
  clearAnnotatedTextCache();
  const id = _id as string;

  renderDemoDiv(title, id);

  // Basic text setup
  return createAnnotatedText(id)
    .setTextAdapter(
      TextLineAdapter({
        limit,
      }),
    )
    .setText(text)
    .setAnnotations(_annotations);
};

renderDemo('Show everything', 'no-limit', undefined);

const limitAfterInit = renderDemo(
  'Limit after initial init [10-30]',
  'limit-after-init',
  undefined,
);
limitAfterInit.setTextAdapter({ limit: { start: 10, end: 30 } });
const limitAfterIgnoreLinesInit = renderDemo(
  'Limit after initial init - ignore lines init [10-30]',
  'limit-after-init-ignore-lines',
  undefined,
);
limitAfterIgnoreLinesInit.setTextAdapter({
  limit: {
    start: 10,
    end: 30,
    ignoreLines: true,
  },
});

annotations.forEach((a) => {
  renderDemo(
    `Single annotation - [${a.start} - ${a.end}]`,
    `no-ignore-lines-${a.id}` as LimitIdKeys,
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
    `ignore-lines-${a.id}` as LimitIdKeys,
    {
      start: a.start,
      end: a.end,
      ignoreLines: true,
    },
    [a],
  );
});

// markdown
const renderDemoMD = (
  title: string,
  _id: LimitIdKeys,
  limit: Limit | undefined,
  _annotations = MarkdownLimit.annotations,
) => {
  // Clear any cached instances
  clearAnnotatedTextCache();
  const id = _id as string;

  renderDemoDiv(
    title + (limit ? `[${limit.start}-${limit.end}]` : ''),
    id,
    'demo-container-md',
  );

  // Basic text setup
  return createAnnotatedText(id)
    .setTextAdapter(
      MarkdownTextAdapter({
        limit,
      }),
    )
    .setAnnotationAdapter(W3CAnnotationAdapter())
    .setText(MarkdownLimit.text)
    .setAnnotations(_annotations);
};
renderDemoMD('Full Demo,', 'markdown-no-limit', undefined);
renderDemoMD('With limit', 'markdown-limit', MarkdownLimit.limit, []);
renderDemoMD(
  'Ignore limit',
  'markdown-limit-ignore-lines',
  MarkdownLimit.limitIgnoreLines,
  [],
);
