import { gutterHeightIds, GutterHeightsKeys } from './testIds';
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  DefaultRenders,
  PlainTextAdapter,
  TextLineAdapter
} from '../../libs/core/src';
import { renderDemoDiv } from '../_utils/render-demo';
import { MarkdownTextAdapter } from '@ghentcdh/annotated-text--markdown';

// Clear any cached instances
clearAnnotatedTextCache();

const text = `Feathers & Fur
An unlikely friendship bloomed between a colorful parrot and a gentle dog. One spoke in squawks and mimicked laughter, the other communicated through tail wags and soft brown eyes. Yet somehow, without sharing a common language, they understood each other perfectly.
Every morning they claimed the same sunny spot on the couch, the parrot perched boldly on the dog's broad back. The dog never minded. He simply sighed contentedly, as if carrying his feathered companion was the most natural thing in the world.
Their bond reminded everyone nearby that friendship needs no explanation — only warmth, presence, and a willingness to share the light.`;

const markdownText = `Feathers & Fur

An unlikely *friendship* bloomed between a colorful **parrot** and a gentle **dog**. One spoke in squawks and mimicked laughter, the other communicated through tail wags and soft brown eyes. Yet somehow, without sharing a common language, they understood each other perfectly.

Every morning they claimed the same sunny spot on the couch, the parrot perched boldly on the dog's broad back. The dog never minded. He simply sighed contentedly, as if carrying his feathered companion was the most natural thing in the world.

Their bond reminded everyone nearby that friendship needs no explanation — only warmth, presence, and a willingness to share the light.`;

const lines = `1. Feathers & Fur\n2. An unlikely friendship bloomed between a colorful parrot and a gentle dog. One spoke in squawks and mimicked laughter, the other communicated through tail wags and soft brown eyes. Yet somehow, without sharing a common language, they understood each other perfectly.\n3. Every morning they claimed the same sunny spot on the couch, the parrot perched boldly on the dog's broad back. The dog never minded. He simply sighed contentedly, as if carrying his feathered companion was the most natural thing in the world.
4. Their bond reminded everyone nearby that friendship needs no explanation — only warmth, presence, and a willingness to share the light.`;

const annotations = [
  { id: '1', start: 0, end: 100, renderer: DefaultRenders.underline },
  { id: '2', start: 0, end: 100, renderer: DefaultRenders.gutter },
  { id: '3', start: 101, end: 200, renderer: DefaultRenders.gutter },
  { id: '4', start: 101, end: 200, renderer: DefaultRenders.underline },
] as any;

const configuration: Record<GutterHeightsKeys, any> = {
  plainText: {
    text: text,
    adapter: PlainTextAdapter,
  },
  markdown: {
    text: markdownText,
    adapter: MarkdownTextAdapter,
  },
  textLine: {
    text: lines,
    adapter: TextLineAdapter,
  },
};

const renderDifferentLineHeight = (
  _id: GutterHeightsKeys,
  defaultRender: string,
  _annotations = annotations,
) => {
  const id = gutterHeightIds[_id];
  const title = `${_id}`;

  renderDemoDiv(title, id);

  const params = configuration[_id];

  // Basic text setup
  createAnnotatedText<any>(id)
    .setTextAdapter(params.adapter())
    .setRenderParams({
      renderFn: (a) => a.renderer ?? defaultRender,
    })
    .setText(params.text)
    .setAnnotations(_annotations);
};

renderDifferentLineHeight('plainText', DefaultRenders.underline);
renderDifferentLineHeight('markdown', DefaultRenders.underline);
renderDifferentLineHeight('textLine', DefaultRenders.underline);

const selection = text.substring(0, 100);
