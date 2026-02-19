import {
  type Annotation,
  createGutterStyle,
  createHighlightStyle,
} from '@ghentcdh/annotated-text';

export type DemoAnnotation = Annotation & {
  style?: string;
  color?: string;
  target: string;
  id: string;
};

const DefaultRenderFn = (annotation: DemoAnnotation) => annotation.target;

const DefaultRender = {
  renderFn: DefaultRenderFn,
};

export const htmlColors: Partial<Record<string, string>> = {
  orthography: '#f58231',
  typography: '#e61919',
  morpho_syntactical: '#18aa2a',
  lexis: '#f032e6',
  language: '#1E64C8',
  handshift: '#9e2a2b',
  ltsa: '#335c67',
  gtsa: '#bb4430',
  gts: '#6a4c93',
  lts: '#e9fff9',
};

const DefaultStyleFn = (annotation: DemoAnnotation) => {
  if (typeof annotation.color === 'string') {
    return {
      default: createHighlightStyle(annotation.color),
    };
  }

  if (annotation.label) {
    const color = htmlColors[annotation.label] || '#000000';
    return {
      default:
        annotation.target === 'gutter'
          ? createGutterStyle(color)
          : createHighlightStyle(color),
    };
  }

  if (annotation.style) {
    return annotation.style;
  }

  return null;
};

const DefaultStyle = {
  styleFn: DefaultStyleFn,
};

export const DemoAnnotationConfig = {
  render: DefaultRender,
  style: DefaultStyle,
};
