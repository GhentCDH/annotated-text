import { styleIds, type StyleKeys } from './testIds';
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  type CustomAnnotationStyle,
  DefaultRenders,
  TextLineAdapter,
} from '../../src';
import { renderDemoDiv } from '../_utils/render-demo';

// Clear any cached instances
clearAnnotatedTextCache();

const text = `1. Hello world. This is a simple text example.
2. This text has some annotations.`;

const config: Record<
  StyleKeys,
  { renderer: string; withTags?: boolean; active?: string[] }
> = {
  defaultUnderline: { renderer: DefaultRenders.underline },
  defaultHighlight: { renderer: DefaultRenders.highlight },
  withTags: { renderer: DefaultRenders.highlight, withTags: true },
  oneActiveHighlight: { renderer: DefaultRenders.highlight, active: ['1'] },
  oneActiveUnderline: { renderer: DefaultRenders.underline, active: ['1'] },
};

const annotations = [
  { id: '1', start: 0, end: 8, style: 'style-1' },
  {
    id: '2',
    start: 9,
    end: 15,
    renderer: DefaultRenders.underline,
    style: 'style-2',
  },
  {
    id: '3',
    start: 38,
    end: 59,
    renderer: DefaultRenders.highlight,
    style: 'style-2',
  },
  {
    id: '4',
    start: 0,
    end: 60,
    renderer: DefaultRenders.gutter,
    style: 'style-3',
  },
] as any;

const style1: CustomAnnotationStyle = {
  default: { backgroundColor: '#ffff00' },
  active: {
    backgroundColor: '#00ff00',
    borderColor: '#1900ff',
    borderWidth: 5,
  },
};
const style2: CustomAnnotationStyle = {
  default: {},
};
const style3: CustomAnnotationStyle = {
  default: { backgroundColor: '#0000ff' },
};

const renderDifferentLineHeight = (
  _id: StyleKeys,
  _annotations = annotations,
) => {
  const id = styleIds[_id];

  const params = config[_id];
  const title = `Different styles:  ${params.renderer} with tags: ${params.withTags ?? false}`;

  renderDemoDiv(title, id);

  // Basic text setup
  const textSetup = createAnnotatedText<any>(id)
    .setTextAdapter(TextLineAdapter())
    .setAnnotationAdapter({ edit: true, create: true })
    .setRenderParams({
      renderFn: (a) => a.renderer ?? params.renderer,
    })
    .setStyleParams({
      styleFn: (a) => a.style,
    })
    .registerStyle('style-1', style1)
    .registerStyle('style-2', style2)
    .registerStyle('style-3', style3)
    .setTagLabelFn((tag) => (params.withTags ? `Tag: ${tag.id}` : undefined))
    .setText(text)
    .setAnnotations(_annotations);
  if (params.active) {
    textSetup.selectAnnotations(params.active);
  }
};

renderDifferentLineHeight('defaultUnderline');
renderDifferentLineHeight('defaultHighlight');
renderDifferentLineHeight('withTags');
renderDifferentLineHeight('oneActiveHighlight');
renderDifferentLineHeight('oneActiveUnderline');
