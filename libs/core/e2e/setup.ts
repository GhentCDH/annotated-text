// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  PlainTextAdapter,
  TextLineAdapter
} from '@ghentcdh/annotated-text';

// Clear any cached instances
clearAnnotatedTextCache();

// Basic text setup
const basicText = createAnnotatedText('basic-text', {
  text: PlainTextAdapter({}),
});
basicText.setText('Hello world. This is a simple text example.');

// With annotations
const withAnnotations = createAnnotatedText('with-annotations', {
  text: PlainTextAdapter({}),
});
withAnnotations
  .setText('Hello world. This text has some annotations.')
  .setAnnotations([
    { id: '1', start: 0, end: 5 },
    { id: '2', start: 6, end: 11 },
    { id: '3', start: 23, end: 26 },
  ]);

// Overlapping annotations
const overlapping = createAnnotatedText('overlapping', {
  text: PlainTextAdapter({}),
});
overlapping
  .setText('This text has overlapping annotations that stack.')
  .setAnnotations([
    { id: '1', start: 0, end: 20 },
    { id: '2', start: 10, end: 30 },
    { id: '3', start: 15, end: 25 },
  ]);

// RTL text
const rtlText = createAnnotatedText('rtl-text', {
  text: TextLineAdapter({ textDirection: 'rtl' }),
});
rtlText
  .setText('مرحبا بالعالم. هذا نص عربي.')
  .setAnnotations([{ id: '1', start: 0, end: 5 }]);

// Interactive with event logging
const interactive = createAnnotatedText('interactive', {
  text: PlainTextAdapter({}),
  annotation: {
    edit: true,
    create: true,
  },
});

const eventLog = document.getElementById('event-log')!;

interactive
  .setText(
    'Click on annotations to see events. Try selecting text to create new annotations.',
  )
  .setAnnotations([
    { id: '1', start: 0, end: 5 },
    { id: '2', start: 9, end: 20 },
  ])
  .on('all', (event) => {
    const logEntry = document.createElement('div');
    logEntry.textContent = `Event: ${event.event} - ${JSON.stringify(event.data?.id ?? event.data)}`;
    eventLog.appendChild(logEntry);

    // Keep only last 5 events
    while (eventLog.children.length > 5) {
      eventLog.removeChild(eventLog.firstChild!);
    }
  });

// Expose for test access
(window as any).__testInstances = {
  basicText,
  withAnnotations,
  overlapping,
  rtlText,
  interactive,
};
