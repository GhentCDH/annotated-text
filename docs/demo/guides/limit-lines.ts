/* eslint-disable no-console */
import { type Annotation, createAnnotatedText, MarkdownTextAdapter, TextLineAdapter } from '@ghentcdh/annotated-text';
import { greekText, markdownText, plainText } from '../data';

const printPosition = (event: any) => {
  const annotation = event.data.annotation as Annotation;
  console.log('Annotation start:', annotation.start, ' end:', annotation.end);
};

export const limitLinesPlainText = (id: string, ignoreLines?: boolean) => {
  createAnnotatedText(id)
    .setTextAdapter({
      limit: { start: 200, end: 400, ignoreLines },
    })
    .setAnnotationAdapter({ edit: true, create: true })
    .setStyleParams(markdownText.styleParams)
    .setRenderParams(markdownText.renderParams)
    .setText(plainText.text)
    .setAnnotations(plainText.annotations)
    .on('annotation-edit--end', printPosition);
};

export const limitLinesMarkdown = (id: string, ignoreLines?: boolean) => {
  createAnnotatedText(id)
    .setTextAdapter(
      MarkdownTextAdapter({
        limit: { start: 57, end: 400, ignoreLines },
      }),
    )
    .setAnnotationAdapter({ edit: true, create: true })
    .setStyleParams(markdownText.styleParams)
    .setRenderParams(markdownText.renderParams)
    .setText(markdownText.text)
    .setAnnotations(markdownText.annotations)
    .on('annotation-edit--end', printPosition);
};
export const limitLinesLineText = (id: string, ignoreLines?: boolean) => {
  createAnnotatedText(id)
    .setTextAdapter(
      TextLineAdapter({
        limit: { start: 57, end: 400, ignoreLines },
      }),
    )
    .setAnnotationAdapter({ edit: true, create: true })
    .setStyleParams(greekText.styleParams)
    .setRenderParams(greekText.renderParams)
    .setText(greekText.text)
    .setAnnotations(greekText.annotations)
    .on('annotation-edit--end', printPosition);
};
