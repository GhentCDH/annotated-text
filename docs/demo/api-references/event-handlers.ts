import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  createAnnotationColor,
} from '@ghentcdh/annotated-text';
import { plainText } from '../data';

export const createEventHandlerDemo = (id: string) => {
  const color = createAnnotationColor('#3b82f6');
  clearAnnotatedTextCache();
  createAnnotatedText(id)
    .setAnnotationAdapter({ create: true, edit: true })
    .setStyleParams({
      styleFn: () => ({
        color: color,
      }),
    })
    .setText(plainText.text)
    .setAnnotations(plainText.annotations)
    .on('all', ({ mouseEvent, event, data }: any) => {
      //es-lint-disable-next-line no-console
      console.log(mouseEvent, event, data);
      const logger = document.getElementById('annotation-logger');
      if (logger) {
        logger.innerHTML = `<p><b>${event}</b>: ${data.annotation.id}</p>`;
      }
    });
};
