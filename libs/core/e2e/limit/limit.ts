// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  type Limit,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';
import { annotations, type LimitIdKeys, text } from './testIds';
import { renderDemoDiv } from '../_utils/render-demo';

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
  return createAnnotatedText(id, {
    text: TextLineAdapter({
      limit,
    }),
  })
    .setText(text)
    .setAnnotations(_annotations);
};

renderDemo('Show everything', 'no-limit', undefined);

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
