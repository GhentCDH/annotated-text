import { renderMarkdownIds, RenderMarkdownKeys } from './testIds';
import {
  type Annotation,
  type AnnotationEventType,
  clearAnnotatedTextCache,
  createAnnotatedText,
  DefaultRenders,
  PlainTextAdapter,
  WordSnapper,
} from '../../libs/core/src';
import { renderDemoDiv, writeToLogDiv } from '../_utils/render-demo';
import { MarkdownTextAdapter } from '@ghentcdh/annotated-text--markdown';
import {
  replaceMarkdownToHtml,
  stripHtmlFromText,
} from '../../libs/markdown/src/lib/adapter/parser'; // Clear any cached instances

// Clear any cached instances
clearAnnotatedTextCache();

const markdownText = `Feathers & Fur

An unlikely *friendship* bloomed between a colorful **parrot** and a gentle **dog**. One spoke in squawks and mimicked laughter, the other communicated through tail wags and soft brown eyes. Yet somehow, without sharing a common language, they understood each other perfectly.

Every morning they claimed the same sunny spot on the couch, the parrot perched boldly on the dog's broad back. The dog never minded. He simply sighed contentedly, as if carrying his feathered companion was the most natural thing in the world.

Their bond reminded everyone nearby that friendship needs no explanation — only warmth, presence, and a willingness to share the light.`;

const styledText = `# Feathers & Fur

An unlikely *friendship* bloomed between a colorful **parrot** and a gentle **dog**. One spoke in squawks and mimicked laughter, the other communicated through tail wags and soft brown eyes. Yet somehow, without sharing a common language, they understood each other perfectly.

Every morning they claimed the same sunny spot on the couch, the parrot perched boldly on the dog's broad back. The dog never minded. He simply sighed contentedly, as if carrying his feathered companion was the most natural thing in the world.

Their bond reminded everyone nearby that friendship needs no explanation — only warmth, presence, and a willingness to share the light.`;

const fullHtml = replaceMarkdownToHtml(markdownText);
const fullFlatText = stripHtmlFromText(fullHtml);
const annotations = [
  { id: '1', start: 0, end: 100 },
  { id: '2', start: 0, end: 100, renderer: DefaultRenders.gutter },
  { id: '3', start: 100, end: 200, renderer: DefaultRenders.gutter },
  { id: '4', start: 100, end: 200 },
  { id: '5', start: 301, end: 341, renderer: DefaultRenders.underline },
] as any;

const configuration: Record<RenderMarkdownKeys, any> = {
  styling: {
    text: styledText,
    adapter: MarkdownTextAdapter,
  },
  underline: {
    text: markdownText,
    adapter: MarkdownTextAdapter,
  },
  highlight: {
    text: markdownText,
    adapter: MarkdownTextAdapter,
  },
  highlight_wordsnapper: {
    text: markdownText,
    adapter: MarkdownTextAdapter,
    snapper: new WordSnapper(),
  },
  highlight_plain: {
    text: fullFlatText,
    adapter: PlainTextAdapter,
  },
  limit: {
    text: markdownText,
    adapter: MarkdownTextAdapter,
    limit: {
      start: 301,
      end: 341,
      ignoreLines: true,
    },
  },
  limit_no_ignore: {
    text: markdownText,
    adapter: MarkdownTextAdapter,
    limit: {
      start: 301,
      end: 341,
      ignoreLines: false,
    },
  },
};

const renderDifferentLineHeight = (
  _id: RenderMarkdownKeys,
  defaultRender: string,
  _annotations = annotations,
) => {
  const id = renderMarkdownIds[_id];
  const title = `${_id}`;

  renderDemoDiv(title, id, 'demo-container', true);

  const writeLog = (event: AnnotationEventType, a: Annotation) => {
    writeToLogDiv(id, `${event}: ${a.start}-${a.end}`);
  };
  const params = configuration[_id];

  // Basic text setup
  const annotatedText = createAnnotatedText<any>(id)
    .setAnnotationAdapter({ edit: true, create: true })
    .setTextAdapter(params.adapter({ limit: params.limit }))
    .setRenderParams({
      renderFn: (a) => a.renderer ?? defaultRender,
    })
    .setText(params.text)
    .setAnnotations(_annotations)
    .on('annotation-create--start', (e) => {
      writeLog(e.event, e.data.annotation);
    })
    .on('annotation-create--end', (e) => {
      writeLog(e.event, e.data.annotation);
    })
    .on('annotation-create--move', (e) => {
      writeLog(e.event, e.data.annotation);
    })
    .on('annotation-edit--start', (e) => {
      writeLog(e.event, e.data.annotation);
    })
    .on('annotation-edit--end', (e) => {
      writeLog(e.event, e.data.annotation);
    })
    .on('annotation-edit--move', (e) => {
      writeLog(e.event, e.data.annotation);
    });

  if (params.snapper) {
    annotatedText.setSnapper(params.snapper);
  }
};

renderDifferentLineHeight('styling', DefaultRenders.underline);
renderDifferentLineHeight('underline', DefaultRenders.underline);
renderDifferentLineHeight('highlight', DefaultRenders.highlight);
renderDifferentLineHeight('highlight_wordsnapper', DefaultRenders.highlight);
renderDifferentLineHeight('highlight_plain', DefaultRenders.highlight);
renderDifferentLineHeight('limit', DefaultRenders.highlight);
renderDifferentLineHeight('limit_no_ignore', DefaultRenders.highlight);
