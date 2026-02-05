import { renderDemoDiv, writeToLogDiv } from '../_utils/render-demo';
import {
  Annotation,
  AnnotationEventType,
  createAnnotatedText,
  W3CAnnotationAdapter,
} from '../../src';
import { text } from './text';
import { annotations } from './annotations';

const mainContainer = 'playground';

const textId = 'playground-text';

const rendered = renderDemoDiv('Playground', textId, mainContainer, true);
const writeLog = (event: AnnotationEventType, a: Annotation) => {
  writeToLogDiv(textId, `${event}: ${a.start}-${a.end}`);
};

const annotatedText = createAnnotatedText(textId, {
  text: { textOffset: 1 },
  // annotation: {
  //   tagConfig: {
  //     enabled: false,
  //     tagFn: (a: any) => (a.renderer ? '' : a.label || 'new one'),
  //   },
  //   edit: false,
  //   render: {
  //     renderFn: (a: any) => a.renderer,
  //   },
  //   style: {
  //     styleFn: (a: any) => ({
  //       color: createAnnotationColor(a.color),
  //     }),
  //   },
  // },
  annotation: W3CAnnotationAdapter({
    sourceUri: 'aade11b7-4685-47b9-928c-240de2adcece',
  }),
})
  .setText(text)
  .setAnnotations(annotations);
