// eslint-disable-next-line @nx/enforce-module-boundaries
import { greekText } from '@demo/data';
import { type GreekIdKeys, greekIds } from './testIds';
import { renderDemoDiv } from '../_utils/render-demo';
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from '../../src';

const annotations = [];

const renderDemo = (
  title: string,
  _id: GreekIdKeys,
  _annotations = annotations,
) => {
  // Clear any cached instances
  clearAnnotatedTextCache();
  const id = greekIds[_id];

  renderDemoDiv(title, id);

  // Basic text setup
  createAnnotatedText(id)
    .setTextAdapter(TextLineAdapter())
    .setAnnotationAdapter({ edit: true, create: true })
    .setRenderParams(greekText.annotationConfig.render)
    .setStyleParams(greekText.annotationConfig.style)
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
};

renderDemo('Greek text', 'greek-text');
