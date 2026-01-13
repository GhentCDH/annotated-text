 
import { type CrudIdKeys, crudIds } from './testIds';
import { renderDemoDiv, writeToLogDiv } from '../_utils/render-demo';
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  createAnnotationColor,
  DefaultRenders,
} from '../../src';
import { DemoShortText } from '../_demo/data-short';

const annotations = DemoShortText.annotations;
const text = DemoShortText.text;

type Params = {
  create?: true;
  edit?: true;
};

const ParamConfig: Record<CrudIdKeys, Params> = {
  'create-edit': { edit: true, create: true },
  create: { create: true },
  default: {},
  edit: { edit: true },
};

const renderDemo = (
  _id: CrudIdKeys,
  title: string,
  renderer: string = DefaultRenders.highlight,
) => {
  const id = crudIds[_id];
  // Clear any cached instances
  clearAnnotatedTextCache();

  renderDemoDiv(title, id, true);

  const params = ParamConfig[_id];

  // Basic text setup
  createAnnotatedText(id, {
    annotation: {
      edit: params.edit ?? false,
      create: params.create ?? false,
      render: {
        renderFn: (a: any) => a.renderer ?? renderer,
      },
      style: {
        styleFn: (a: any) => ({
          color: createAnnotationColor(a.color),
        }),
      },
    },
  })
    .setText(text)
    .setAnnotations(annotations)
    .on('annotation-create--start', (e) => {
      writeToLogDiv(id, e.event);
    })
    .on('annotation-create--end', (e) => {
      writeToLogDiv(id, e.event);
    })
    .on('annotation-create--move', (e) => {
      writeToLogDiv(id, e.event);
    })
    .on('annotation-edit--start', (e) => {
      writeToLogDiv(id, e.event);
    })
    .on('annotation-edit--end', (e) => {
      writeToLogDiv(id, e.event);
    })
    .on('annotation-edit--move', (e) => {
      writeToLogDiv(id, e.event);
    });
};

renderDemo('default', 'Default');
renderDemo('create', 'create');
renderDemo('edit', 'edit');
renderDemo('create-edit', 'create + edit');
