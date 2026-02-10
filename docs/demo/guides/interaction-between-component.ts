import {
  type Annotation,
  type AnnotationId,
  createAnnotatedText,
  getAnnotatedText,
  TextLineAdapter
} from '@ghentcdh/annotated-text';
import { type DemoAnnotation, greekText } from '../data';

const text = greekText.text;
const annotations = greekText.annotations;

const getDivId = (id: AnnotationId) => {
  return `annotated-interaction-${id}`;
};

export const createAnnotatedTextWithLines = (
  annotation: Annotation,
  annotations: DemoAnnotation[],
  textContainer: HTMLElement,
) => {
  const ann = document.createElement('div');
  ann.id = getDivId(annotation.id);
  ann.style.borderBottom = '1px solid #ccc';
  ann.style.paddingBottom = '10px';
  textContainer.appendChild(ann);

  return createAnnotatedText(ann.id, {
    text: TextLineAdapter({
      limit: {
        start: annotation.start,
        end: annotation.end,
      },
    }),
    annotation: {
      ...greekText.annotationConfig,
      edit: true,
    },
  })
    .setRenderParams(greekText.annotationConfig.render)
    .setStyleParams(greekText.annotationConfig.style)
    .setText(text)
    .setAnnotations(annotations);
};

export const interActionBetweenComponents = (id: string) => {
  if (!document) return;
  const element = document.getElementById(id);
  const _annotations = annotations.filter((a) => a.target === 'text');
  // .slice(0, 40);

  const textContainer = document.createElement('div');
  textContainer.style.display = 'grid';
  textContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
  textContainer.style.gap = '10px';
  element.appendChild(textContainer);
  const fullText = document.createElement('div');
  textContainer.appendChild(fullText);
  const annotationsContainer = document.createElement('div');
  textContainer.appendChild(annotationsContainer);

  const fullTextId = getDivId('the-large-text');
  createAnnotatedTextWithLines(
    { start: 0, end: 24734, id: 'the-large-text' },
    annotations,
    fullText,
  )
    .on('annotation-edit--move', (event) => {
      const annotation = event.data.annotation;
      getAnnotatedText(getDivId(annotation.id))
        .highlightAnnotations([annotation.id])
        .updateAnnotation(annotation.id, {
          ...event.data.annotation,
        });
    })
    .on('mouse-enter', (event) => {
      const annotation = event.data.annotation as Annotation;
      getAnnotatedText(getDivId(annotation.id)).highlightAnnotations([
        annotation.id,
      ]);
    });

  _annotations.forEach((annotation) => {
    createAnnotatedTextWithLines(annotation, [annotation], annotationsContainer)
      .on('annotation-edit--move', (event) => {
        const annotation = event.data.annotation as Annotation;
        getAnnotatedText(fullTextId)
          .highlightAnnotations([annotation.id])
          .updateAnnotation(annotation.id, {
            ...event.data.annotation,
          });
      })
      .on('annotation-edit--end', () => {
        getAnnotatedText(fullTextId).highlightAnnotations([]);
      })
      .on('mouse-leave', (event) => {
        getAnnotatedText(fullTextId).highlightAnnotations([]);
      })
      .on('annotation-edit--end', () => {
        getAnnotatedText(fullTextId).highlightAnnotations([]);
      });
  });
};
