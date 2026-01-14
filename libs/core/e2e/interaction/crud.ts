import { type CrudIdKeys, crudIds } from './testIds';
import { renderDemoDiv, writeToLogDiv } from '../_utils/render-demo';
import {
  Annotation,
  AnnotationEventType,
  clearAnnotatedTextCache,
  createAnnotatedText,
  createAnnotationColor,
} from '../../src';
import { DemoShortText } from '../_demo/data-short';

const annotations = DemoShortText.annotations;
const text = DemoShortText.text;

type Params = {
  create?: true;
  edit?: true;
  tags?: true;
  offset?: number;
  mainContainer?: string;
};

const offsetMainId = 'demo-with-offsets';

const ParamConfig: Record<CrudIdKeys, Params> = {
  'create-edit': { edit: true, create: true },
  'create-edit-tags': { edit: true, create: true, tags: true },
  create: { create: true },
  default: {},
  edit: { edit: true },
  'offset-1': {
    edit: true,
    create: true,
    offset: 1,
    mainContainer: offsetMainId,
  },
  'offset-0': {
    edit: true,
    create: true,
    offset: 0,
    mainContainer: offsetMainId,
  },
  'offset-10': {
    edit: true,
    create: true,
    offset: 10,
    mainContainer: offsetMainId,
  },
  'offset--10': {
    edit: true,
    create: true,
    offset: -10,
    mainContainer: offsetMainId,
  },
};

const renderDemo = (_id: CrudIdKeys, title: string) => {
  const id = crudIds[_id];
  // Clear any cached instances
  clearAnnotatedTextCache();

  const params = ParamConfig[_id];

  renderDemoDiv(title, id, params.mainContainer, true);

  const writeLog = (event: AnnotationEventType, a: Annotation) => {
    writeToLogDiv(id, `${event}: ${a.start}-${a.end}`);
  };

  // Basic text setup
  createAnnotatedText(id, {
    text: { textOffset: params.offset ?? 0 },
    annotation: {
      tagConfig: {
        enabled: params.tags ?? false,
        tagFn: (a: any) => (a.renderer ? '' : a.label || 'new one'),
      },
      edit: params.edit ?? false,
      create: params.create ?? false,
      render: {
        renderFn: (a: any) => a.renderer,
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
      writeLog(e.event, e.data.annotation);
    })
    .on('annotation-create--end', (e) => {
      writeLog(e.event, e.data.annotation);
    })
    .on('annotation-create--move', (e) => {
      writeLog(e.event, e.data.annotation);
    })
    .on('annotation-edit--start', (e) => {
      writeLog(e.event, e.data.annotation);
    })
    .on('annotation-edit--end', (e) => {
      writeLog(e.event, e.data.annotation);
    })
    .on('annotation-edit--move', (e) => {
      writeLog(e.event, e.data.annotation);
    });
};

renderDemo('default', 'Default');
renderDemo('create', 'create');
renderDemo('edit', 'edit');
renderDemo('create-edit', 'create + edit');
renderDemo('create-edit-tags', 'create + edit with tags');
renderDemo('offset-1', 'offset 1');
renderDemo('offset-0', 'offset 0');
renderDemo('offset-10', 'offset 10');
renderDemo('offset--10', 'offset -10');
