import { text } from './text';
import { annotations } from './annotations';
import { renderDemoDiv, writeToLogDiv } from '../_utils/render-demo';
import { type Annotation, type AnnotationEventType, createAnnotatedText } from '../../src';

const mainContainer = 'playground';

const textId = 'playground-text';

const rendered = renderDemoDiv('Playground', textId, mainContainer, true);
const writeLog = (event: AnnotationEventType, a: Annotation) => {
  writeToLogDiv(textId, `${event}: ${a.start}-${a.end}`);
};

const annotatedText = createAnnotatedText(textId)
  .setAnnotationAdapter({
    edit: true,
    create: true,
  })
  .setText(text)
  .setAnnotations(annotations);
