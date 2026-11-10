import {
  createAnnotatedText,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';
import { greekText } from '../data';

const document = globalThis.document;

export const zoomText = (id: string) => {
  if (!document) return;
  const element = document.getElementById(id);

  // A fixed-height, vertically resizable box: zooming keeps the page intact
  const box = document.createElement('div');
  box.style.height = '250px';
  box.style.overflow = 'auto';
  box.style.resize = 'vertical';
  box.style.border = '1px solid #ccc';

  const annotationDiv = document.createElement('div');
  annotationDiv.id = `${id}-text`;
  box.appendChild(annotationDiv);
  element.appendChild(box);

  createAnnotatedText(annotationDiv.id, { textAdapter: TextLineAdapter() })
    .setRenderParams(greekText.renderParams)
    .setStyleParams(greekText.styleParams)
    .setText(greekText.text)
    .setAnnotations(greekText.annotations)
    .setZoomControls({ buttons: true, wheel: true, keyboard: true });
};
