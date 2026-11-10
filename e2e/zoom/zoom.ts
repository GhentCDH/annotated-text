import {
  clearAnnotatedTextCache,
  createAnnotatedText,
} from '../../libs/core/src';

const lines = Array.from(
  { length: 40 },
  (_, i) => `Line ${i}: the quick brown fox jumps over the lazy dog.`,
);
export const text = lines.join('\n');

const annotationOn = (id: string, word: string, line: number) => {
  const start =
    lines.slice(0, line).reduce((sum, l) => sum + l.length + 1, 0) +
    lines[line].indexOf(word);
  return { id, start, end: start + word.length, label: word };
};

export const annotations = [
  annotationOn('quick-0', 'quick', 0),
  annotationOn('lazy-0', 'lazy', 0),
  annotationOn('fox-20', 'fox', 20),
];

clearAnnotatedTextCache();

const annotatedText = createAnnotatedText<any>('zoom')
  .setText(text)
  .setAnnotations(annotations)
  .setZoomControls({ buttons: true, wheel: true, keyboard: true })
  .on('zoom', ({ data }) => {
    document.body.dataset['zoom'] = `${data.zoom}`;
  });

(window as any).annotatedText = annotatedText;
(window as any).annotations = annotations;
