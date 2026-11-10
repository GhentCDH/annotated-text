import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
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

/** Create and edit events, so tests can check the offsets after zooming */
const events: { event: string; start: number; end: number }[] = [];
const logEvent = ({ event, data }: any) =>
  events.push({
    event,
    start: data.annotation.start,
    end: data.annotation.end,
  });

const annotatedText = createAnnotatedText<any>('zoom')
  .setAnnotationAdapterParams({ edit: true, create: true })
  .on('annotation-create--end', logEvent)
  .on('annotation-edit--end', logEvent)
  .setText(text)
  .setAnnotations(annotations)
  .setZoomControls({ buttons: true, wheel: true, keyboard: true })
  .on('zoom', ({ data }) => {
    document.body.dataset['zoom'] = `${data.zoom}`;
  });

(window as any).annotatedText = annotatedText;
(window as any).text = text;
(window as any).events = events;

const rtlLines = Array.from(
  { length: 10 },
  () => 'مرحبا بالعالم. هذا نص عربي.',
);
const rtlText = rtlLines.join('\n');
const rtlWordStart =
  rtlLines.slice(0, 3).reduce((sum, l) => sum + l.length + 1, 0) +
  rtlLines[3].indexOf('عربي');

(window as any).annotatedTextRtl = createAnnotatedText<any>('zoom-rtl', {
  textAdapter: TextLineAdapter({ textDirection: 'rtl' }),
})
  .setZoomControls({ buttons: true })
  .setText(rtlText)
  .setAnnotations([
    { id: 'rtl-3', start: rtlWordStart, end: rtlWordStart + 'عربي'.length },
  ]);
(window as any).annotations = annotations;
