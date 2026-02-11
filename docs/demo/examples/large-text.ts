import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';
import { largeGreekText } from '../data';
import { DemoAnnotationConfig } from '../data/data.types';

export const largeText = (id: string) => {
  clearAnnotatedTextCache();
  const startTime = Date.now();
  createAnnotatedText(id)
    .setTextAdapter(TextLineAdapter())
    .setRenderParams(DemoAnnotationConfig.render)
    .setStyleParams(DemoAnnotationConfig.style)
    .setText(largeGreekText.text)
    .setAnnotations(largeGreekText.annotations);

  const endTime = Date.now();
  const tookTime = endTime - startTime;
  const logMessage = `took ${tookTime} ms , ${tookTime / 1000} s`;
  console.log('TIMER', logMessage);
};
