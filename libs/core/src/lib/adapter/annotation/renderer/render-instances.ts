import { merge } from 'lodash-es';
import { type RenderParams } from './annotation-render';
import { DefaultRenders } from './default.renderer';
import { GutterAnnotationRender } from './GutterAnnotationRender';
import { HighlightAnnotationRender } from './TextAnnotationRender';
import { UnderLineAnnotationRender } from './UnderLineAnnotationRender';
import { Debugger } from '../../../utils/debugger';
import type { BaseAnnotation, TextAnnotation } from '../../../model';
import { BaseAnnotationDiFn } from '../../../di/BaseAnnotationDiFn';
import { type AnnotationModule } from '../../../di/annotation.module';
import { AnnotationAdapterToken } from '../../../di/tokens';
import { type AnnotationAdapter } from '../../annotation';

export class RenderInstances<
  ANNOTATION extends BaseAnnotation,
> extends BaseAnnotationDiFn {
  private renderParams = {
    defaultRenderer: DefaultRenders.highlight,
    styleFn: (annotation: ANNOTATION) => null,
    renderFn: (annotation: ANNOTATION) => null,
  } as unknown as RenderParams<ANNOTATION>;

  // Should be removed
  // protected readonly renderMap = new Map<string, AnnotationRender<any>>();

  constructor(annotationModule: AnnotationModule) {
    super();
    this.setModule(annotationModule);

    this.renderParams = merge(
      this.renderParams,
      this.inject<AnnotationAdapter<ANNOTATION>>(AnnotationAdapterToken)
        .renderParams ?? {},
    );

    this.annotationModule.registerRender(
      DefaultRenders.highlight,
      () => new HighlightAnnotationRender(DefaultRenders.highlight),
    );
    this.annotationModule.registerRender(
      DefaultRenders.gutter,
      () => new GutterAnnotationRender(DefaultRenders.gutter),
    );
    this.annotationModule.registerRender(
      DefaultRenders.underline,
      () => new UnderLineAnnotationRender(DefaultRenders.underline),
    );
  }

  get defaultRenderer() {
    return this.renderParams.defaultRenderer;
  }

  private getRenders() {
    return this.annotationModule.getAllRenderInstances();
  }

  getGutterRenders() {
    return Array.from(this.getRenders()).filter((r) => r.isGutter);
  }

  getTextRenders() {
    return Array.from(this.getRenders()).filter((r) => !r.isGutter);
  }

  getRenderer(annotation: ANNOTATION) {
    let render = this.renderParams.renderFn?.(annotation);
    if (!render) {
      Debugger.verbose(
        'RenderInstances',
        'Fallback to default renderer as no render was specified for annotation.',
        annotation,
      );
      render = this.defaultRenderer;
    }

    if (this.annotationModule.hasRender(render))
      return this.annotationModule.injectRender(render);

    if (render === this.defaultRenderer) {
      throw new Error('Default renderer not found: ' + this.defaultRenderer);
    }

    Debugger.warn(
      'RenderInstances',
      `Renderer "${render}" not found for annotation. fallback to default renderer: [${this.defaultRenderer}]`,
    );

    return this.annotationModule.injectRender(this.defaultRenderer);
  }

  get highlightInstance() {
    const renderer = this.annotationModule.injectRender('highlight');
    return renderer;
  }

  createDraws(annotation: TextAnnotation) {
    const renderName = annotation._render.render;
    const renderer = this.annotationModule.injectRender(renderName);

    return renderer.createDraws(annotation);
  }
}
