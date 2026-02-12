import { lineHeightIds, type LineHeightKeys } from './testIds';
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  DefaultRenders,
  TextLineAdapter,
} from '../../src';
import { renderDemoDiv } from '../_utils/render-demo';

// Clear any cached instances
clearAnnotatedTextCache();

const text = `1. Hello world. This is a simple text example.
2. This text has some annotations.`;

const annotations = [
  { id: '1', start: 0, end: 8 },
  { id: '2', start: 9, end: 15 },
  { id: '3', start: 38, end: 59 },
  { id: '4', start: 0, end: 60, renderer: DefaultRenders.gutter },
] as any;

const renderDifferentLineHeight = (
  _id: LineHeightKeys,
  lineOffset: number,
  defaultRender: string,
  _annotations = annotations,
) => {
  const id = lineHeightIds[_id];
  const title = `Line height: ${lineOffset}px - ${defaultRender}`;

  renderDemoDiv(title, id);

  // Basic text setup
  createAnnotatedText<any>(id)
    .setTextAdapter(
      TextLineAdapter({
        style: {
          lineOffset,
        },
      }),
    )
    .setRenderParams({
      renderFn: (a) => a.renderer ?? defaultRender,
    })
    .setText(text)
    .setAnnotations(_annotations);
};

renderDifferentLineHeight('underline_offset_2', 2, DefaultRenders.underline);
renderDifferentLineHeight('underline_offset_30', 30, DefaultRenders.underline);
renderDifferentLineHeight('highlight_offset_2', 2, DefaultRenders.highlight);
renderDifferentLineHeight('highlight_offset_10', 10, DefaultRenders.highlight);
renderDifferentLineHeight('highlight_offset_30', 30, DefaultRenders.highlight);
renderDifferentLineHeight('highlight_offset_40', 40, DefaultRenders.highlight, [
  ...annotations,
  { id: '6', start: 55, end: 59 },
  { id: '5', start: 50, end: 59 },
]);
renderDifferentLineHeight('underline_offset_40', 40, DefaultRenders.underline, [
  ...annotations,
  { id: '6', start: 55, end: 59 },
  { id: '5', start: 50, end: 59 },
]);
