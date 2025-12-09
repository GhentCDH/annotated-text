import { merge } from "lodash-es";
import { AnnotationRender, AnnotationRenderParams, AnnotationRenderStyle, RenderParams } from "./annotation-render";
import { TextAdapterStyle } from "../../text";
import { Debugger } from "../../../utils/debugger";
import type { TextAnnotation } from "../../../model";

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

  registerRender<STYLE extends AnnotationRenderStyle>(
    render: AnnotationRender<STYLE>,
  ) {
    this.renderMap.set(render.name, render);
    // Set the first renderer as default if no default is provided
    if (!this.defaultRenderer) this.renderParams.defaultRenderer = render.name;
  }

  updateRenderStyle<STYLE extends AnnotationRenderStyle>(
    name: string,
    style: Partial<STYLE>,
  ) {
    const render = this.renderMap.get(name);
    render?.updateStyle(style);
  }

  getGutterRenders() {
    return Array.from(this.renderMap.values()).filter((r) => r.isGutter);
  }

  getTextRenders() {
    return Array.from(this.renderMap.values()).filter((r) => !r.isGutter);
  }

  getRendererByName(name: string) {
    return this.renderMap.get(name);
  }

  getRenderer(annotation: ANNOTATION) {
    let render = this.renderParams.renderFn?.(annotation);
    if (!render) {
      Debugger.verbose(
        "RenderInstances",
        "Fallback to default renderer as no render was specified for annotation.",
        annotation,
      );
      render = this.defaultRenderer;
    }

    let annotationRender = this.renderMap.get(render);

    if (annotationRender) return annotationRender;

    if (render !== this.defaultRenderer) {
      Debugger.warn(
        "RenderInstances",
        `Renderer "${render}" not found for annotation. fallback to default renderer: [${this.defaultRenderer}]`,
      );

      annotationRender = this.renderMap.get(this.defaultRenderer);
    }

    if (annotationRender) return annotationRender;

    throw new Error("Default renderer not found: " + this.defaultRenderer);
  }

  get highlightInstance() {
    const renderer = this.renderMap.get("highlight");
    if (!renderer) {
      throw new Error("Renderer not found: highlight");
    }
    return renderer;
  }

  createDraws(
    params: AnnotationRenderParams,
    textStyle: TextAdapterStyle,
    parentDimensions: { x: number; y: number },
    annotation: TextAnnotation,
  ) {
    const renderer = this.renderMap.get(annotation._render.render);
    if (!renderer) {
      throw new Error("Renderer not found: " + annotation._render.render);
    }

    return renderer.createDraws(
      params,
      textStyle,
      parentDimensions,
      annotation,
    );
  }
}
