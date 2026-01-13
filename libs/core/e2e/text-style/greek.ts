// eslint-disable-next-line @nx/enforce-module-boundaries
import { greekText } from '@demo/data';
import { type GreekIdKeys } from './testIds';
import { renderDemoDiv } from '../_utils/render-demo';
import { clearAnnotatedTextCache, createAnnotatedText, TextLineAdapter } from '../../src';

const annotations = [];

const renderDemo = (
  title: string,
  _id: GreekIdKeys,
  _annotations = annotations,
) => {
  // Clear any cached instances
  clearAnnotatedTextCache();
  const id = _id as string;

  renderDemoDiv(title, id);

  // Basic text setup
  createAnnotatedText(id, {
    text: TextLineAdapter({}),
    annotation: {
      ...greekText.annotationConfig,
      edit: true,
      create: true,
    },
  })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};

renderDemo('Greek text', 'greek-text');
