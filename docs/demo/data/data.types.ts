import {
  Annotation,
  AnnotationColor,
  createAnnotationAdapterParams,
} from "@ghentcdh/annotated-text";

export type DemoAnnotation = Annotation & {
  style?: string;
  color?: AnnotationColor;
  target: string;
  id: string;
};

const DefaultRenderFn = (annotation: DemoAnnotation) => annotation.target;

const DefaultRender = {
  renderFn: DefaultRenderFn,
};

const DefaultStyleFn = (annotation: DemoAnnotation) => {
  if (annotation.color) {
    return { color: annotation.color };
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
} as createAnnotationAdapterParams<DemoAnnotation>;
