import { type SnapperIdKeys, SnapperIds } from './testIds';
import { renderDemoDiv, writeToLogDiv } from '../_utils/render-demo';
import {
  type Annotation,
  type AnnotationEventType,
  clearAnnotatedTextCache,
  createAnnotatedText,
  createAnnotationColor,
  type Snapper,
  WordSnapper,
} from '../../src';
import { DemoShortText } from '../_demo/data-short';

const annotations = DemoShortText.annotations;
const text = DemoShortText.text;

const renderDemo = (
  _id: SnapperIdKeys,
  title: string,
  params: { startOffset?: number; snapper?: Snapper } = { startOffset: 0 },
) => {
  const id = SnapperIds[_id];
  // Clear any cached instances
  clearAnnotatedTextCache();

  const rendered = renderDemoDiv(title, id, 'demo-container', true);

  const writeLog = (event: AnnotationEventType, a: Annotation) => {
    writeToLogDiv(id, `${event}: ${a.start}-${a.end}`);
  };

  // Basic text setup
  const annotatedText = createAnnotatedText<any>(id).setAnnotationAdapter({
    edit: true,
    create: true,
    startOffset: params.startOffset ?? 0,
  });
  if (params.snapper) {
    annotatedText.setSnapper(params.snapper);
  }

  annotatedText
    .setText(text)
    .setAnnotations(annotations)
    .setStyleParams({
      styleFn: (a: any) => ({ color: createAnnotationColor(a.color) }),
    })
    .setRenderParams({ renderFn: (a) => a.renderer })
    .setTagLabelFn((a) => (a.renderer ? '' : a.label || 'new one'))
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

  return { ...rendered, annotatedText, id };
};

renderDemo('default', 'Default');
renderDemo('wordSnapper', 'WordSnapper', { snapper: new WordSnapper() });
