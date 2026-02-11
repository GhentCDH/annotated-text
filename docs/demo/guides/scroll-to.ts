import {
  AnnotatedText,
  createAnnotatedText,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';
import { v4 as uuidv4 } from 'uuid';
import { greekText } from '../data';

const document = globalThis.document;

export const scrollToAnnotation = (id: string) => {
  if (!document) return;
  const element = document.getElementById(id);
  const annotations = greekText.annotations;
  let annotatedText: AnnotatedText<any> = null;

  const textContainer = document.createElement('div');
  textContainer.style.display = 'flex';
  textContainer.style.flexWrap = 'wrap';
  textContainer.style.gap = '10px';
  annotations.forEach((annotation) => {
    const button = document.createElement('button');
    button.innerHTML = `Scroll to ${annotation.label || annotation.id}`;
    button.onclick = () => {
      annotatedText.scrollToAnnotation(annotation.id);
      annotatedText.highlightAnnotations([annotation.id]);
    };
    textContainer.appendChild(button);
  });
  element.appendChild(textContainer);

  const annotationId = uuidv4();
  const annotationDiv = document.createElement('div');
  annotationDiv.setAttribute('id', annotationId);
  element.appendChild(annotationDiv);
  annotatedText = createAnnotatedText(annotationId)
    .setTextAdapter(TextLineAdapter())
    .setRenderParams(greekText.renderParams)
    .setStyleParams(greekText.styleParams)
    .setText(greekText.text)
    .setAnnotations(annotations);
};
