import { merge } from "lodash-es";
import { Debugger } from "@ghentcdh/annotated-text";
import {
  AnnotationRender,
  AnnotationStyle,
  RenderParams,
} from "./annotation-render";

export class RenderInstances<ANNOTATION> {
  private renderParams = {
    defaultRenderer: null,
    styleFn: (annotation: ANNOTATION) => null,
    renderFn: (annotation: ANNOTATION) => null,
  } as unknown as RenderParams<ANNOTATION>;

  protected readonly renderMap = new Map<string, AnnotationRender<any>>();

  constructor(public readonly params?: Partial<RenderParams<ANNOTATION>>) {
    this.renderParams = merge(this.renderParams, params ?? {});
  }

  get defaultRenderer() {
    return this.renderParams.defaultRenderer;
  }

  registerRender<STYLE extends AnnotationStyle>(
    render: AnnotationRender<STYLE>,
  ) {
    this.renderMap.set(render.name, render);
    // Set the first renderer as default if no default is provided
    if (!this.defaultRenderer) this.renderParams.defaultRenderer = render.name;
  }

  updateRenderStyle<STYLE extends AnnotationStyle>(
    name: string,
    style: Partial<STYLE>,
  ) {
    const render = this.renderMap.get(name);
    render?.updateStyle(style);
  }

  getRenderer(annotation: ANNOTATION) {
    let render = this.renderParams.renderFn?.(annotation);
    if (!render) {
      Debugger.warn(
        "Fallback to default renderer as no render was specified for annotation.",
        annotation,
      );
      render = this.defaultRenderer;
    }

    let annotationRender = this.renderMap.get(render);

    if (annotationRender) return annotationRender;

    if (render !== this.defaultRenderer) {
      Debugger.warn("Render not found, fallback to default renderer.", render);
      annotationRender = this.renderMap.get(this.defaultRenderer);
    }

    if (annotationRender) return annotationRender;

    throw new Error("Default renderer not found: " + this.defaultRenderer);
  }

  render(annotation: ANNOTATION) {
    const renderer = this.getRenderer(annotation);
    return renderer.render;
  }
}
