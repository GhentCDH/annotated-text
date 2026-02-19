// Import styles directly (not through index.ts to avoid Istanbul/Babel issues)
import '../src/lib/style/style.scss';

// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';

// Clear any cached instances
clearAnnotatedTextCache();

// Basic text setup
const basicText = createAnnotatedText('basic-text');
basicText.setText('Hello world. This is a simple text example.');

// With annotations
const withAnnotations = createAnnotatedText('with-annotations');
withAnnotations
  .setText('Hello world. This text has some annotations.')
  .setAnnotations([
    { id: '1', start: 0, end: 5 },
    { id: '2', start: 6, end: 11 },
    { id: '3', start: 23, end: 26 },
  ]);

// Overlapping annotations
const overlapping = createAnnotatedText('overlapping');
overlapping
  .setText('This text has overlapping annotations that stack.')
  .setAnnotations([
    { id: '1', start: 0, end: 20 },
    { id: '2', start: 10, end: 30 },
    { id: '3', start: 15, end: 25 },
  ]);

// RTL text
const rtlText = createAnnotatedText('rtl-text').setTextAdapter(
  TextLineAdapter({ textDirection: 'rtl' }),
);
rtlText
  .setText('مرحبا بالعالم. هذا نص عربي.')
  .setAnnotations([{ id: '1', start: 0, end: 5 }]);

// Expose for test access
(window as any).__testInstances = {
  basicText,
  withAnnotations,
  overlapping,
  rtlText,
};
