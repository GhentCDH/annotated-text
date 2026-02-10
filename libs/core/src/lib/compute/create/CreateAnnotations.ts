import { type AnnotatedText } from './CreateAnnotations.model';
import { EventListener } from '../../events/event.listener';
import {
  type Snapper,
  SnapperToken,
  type TextAdapter,
  type TextAdapterParams,
} from '../../adapter/text';
import {
  type ANNOTATION_CONFIG_KEYS,
  type ANNOTATION_CONFIG_VALUES,
  type AnnotationAdapter,
  type AnnotationStyleParams,
} from '../../adapter/annotation';
import { SvgModel } from '../model/svg.types';
import { Debugger } from '../../utils/debugger';
import {
  type AnnotationEventType,
  type ErrorEventCallback,
  type EventCallback,
} from '../../events';
import { type AnnotationId, type BaseAnnotation } from '../../model';
import {
  type AnnotationRender,
  type AnnotationRenderStyle,
} from '../../adapter/annotation/renderer';
import { type AnnotationStyle } from '../../adapter/annotation/style';
import { InternalEventListener } from '../../events/internal/internal.event.listener';
import { AnnotationModule } from '../../di/annotation.module';
import { rootContainer } from '../../di/container';
import { Draw } from '../draw/Draw';
import { ExternalEventSender } from '../../events/send-event';
import { MainContainer } from '../model/maincontainer';
import { type tagLabelFn, TagRenderer } from '../../tag/TagRenderer';
import { RenderInstances } from '../../adapter/annotation/renderer/render-instances';
import { StyleInstances } from '../../adapter/annotation/style/style-instances';
import { setTextAdapter } from '../../adapter/SetAdapter';

const document = globalThis.document || null;

export class CreateAnnotationsImpl<
  ANNOTATION extends BaseAnnotation,
> implements AnnotatedText<ANNOTATION> {
  private annotationsMap = new Map<AnnotationId, ANNOTATION>();
  private readonly svgModel: SvgModel;
  private readonly draw: Draw<ANNOTATION>;
  private text: string;
  private readonly eventListener: EventListener<ANNOTATION>;

  private readonly annotationModule: AnnotationModule;
  private readonly mainContainer: MainContainer;

  constructor(
    private readonly id: string,
    private readonly annotationAdapter: AnnotationAdapter<ANNOTATION>,
  ) {
    this.annotationModule = new AnnotationModule(rootContainer, {
      annotationAdapter,
    });

    this.svgModel = this.annotationModule.inject(SvgModel);
    this.mainContainer = this.annotationModule.inject(MainContainer);
    this.draw = this.annotationModule.inject<Draw<ANNOTATION>>(Draw);

    const internalEventListener = this.annotationModule.inject(
      InternalEventListener,
    );

    this.eventListener = this.annotationModule.inject(
      EventListener,
    ) as EventListener<ANNOTATION>;

    this.init();

    internalEventListener
      .on('annotation--add', ({ data }) => {
        const fullAnnotation = this.annotationAdapter.format(
          data.annotation,
          true,
          true,
        );

        this.addAnnotation(fullAnnotation!);
      })
      .on('annotation--update', ({ data }) => {
        const fullAnnotation = this.annotationAdapter.format(
          data.annotation,
          false,
          true,
        );
        this.addAnnotation(fullAnnotation!);
      })
      .on('send-event--annotation', ({ data }) => {
        this.annotationModule
          .inject(ExternalEventSender)
          .sendEvent(data, data.additionalData);
      })
      .on('annotation--set-class', ({ data }) => {
        this.svgModel?.setClass(data.annotationUuid, data.cssClass);
      })
      .on('annotation--remove-tag', ({ data }) => {
        this.svgModel?.findTags(data.annotationUuid)?.remove();
      })
      .on('annotation--remove', ({ data }) => {
        this.svgModel
          ?.findRelatedAnnotations(data.annotationUuid, data.selector)
          ?.remove();
      })
      .on('annotation--draw-dummy', ({ data }) => {
        this.draw.annotation.dummy(data.dummyAnnotation, data.color);
      })
      .on('redraw-svg', () => {
        this.redrawSvg();
      });
  }

  private annotations() {
    return Array.from(this.annotationsMap.values());
  }

  public setText(text: string) {
    this.text = text || '';
    this.draw.initDraw(this.text, this.annotations());
    this.setAnnotations(this.annotations());

    return this;
  }

  public setSnapper(snapper: Snapper) {
    this.annotationModule.register(SnapperToken, () => snapper);
    this.recalculate();

    return this;
  }

  public setTagLabelFn(tagFn: tagLabelFn<ANNOTATION> | null) {
    this.annotationModule.inject(TagRenderer).setTagFn(tagFn as any);
    this.recalculate();
    return this;
  }

  public setAnnotations(annotations: ANNOTATION[]) {
    this.annotationsMap.clear();
    annotations.forEach((annotation) => {
      this.annotationsMap.set(annotation.id, annotation);
    });

    this.recalculate();

    return this;
  }

  private recalculate() {
    if (!this.text) {
      Debugger.debug(
        'setAnnotations',
        '------ no lines set, cannot set annotations',
      );
      return this;
    }

    this.draw.initDraw(this.text, this.annotations());
    this.redrawSvg();

    return this;
  }

  public on<EVENT extends AnnotationEventType<ANNOTATION>>(
    event: EVENT,
    callback: EventCallback<EVENT, ANNOTATION>,
  ) {
    this.eventListener.register(event, callback);
    return this;
  }

  public onError(callback: ErrorEventCallback) {
    this.eventListener.registerError(callback);
    return this;
  }

  private init() {
    if (!document) return;
    const id = this.id;

    const mainElement = document?.getElementById(id);
    if (!mainElement) {
      console.error('element not found', id);
      return;
    }

    this.mainContainer.setMainElement(mainElement);

    if (!this.text) {
      return;
    }
    this.redrawSvg();
  }

  private redrawSvg() {
    if (!document) return;

    this.mainContainer.clear();

    // First create the text
    this.svgModel.createTextElement();
    this.draw.text.draw();

    this.mainContainer.setTextElement(this.svgModel.textElement);

    // Create the svg depending on the text element
    this.svgModel.createModel();
    this.mainContainer.setSvg(this.svgModel.node());

    // Start computations with the known values
    this.draw.compute().initialDraw();
  }

  public destroy() {
    Debugger.debug('CreateAnnotations', 'destroy', this.id);
    this.eventListener.sendEvent('destroy', null, null);

    this.mainContainer.destroy();

    return this;
  }

  public highlightAnnotations(ids: AnnotationId[]) {
    this.draw.annotation.highlight(ids);
    return this;
  }

  public selectAnnotations(ids: AnnotationId[]) {
    this.draw.annotation.select(ids);
    return this;
  }

  changeAnnotationAdapterConfig<KEY extends ANNOTATION_CONFIG_KEYS>(
    key: KEY,
    value: ANNOTATION_CONFIG_VALUES<KEY>,
  ): this {
    this.annotationAdapter.setConfig(key, value);
    return this;
  }

  setTextAdapter(adapterOrParams: TextAdapter | TextAdapterParams): this {
    setTextAdapter(this.annotationModule, adapterOrParams);
    this.recalculate();
    return this;
  }

  scrollToAnnotation(id: AnnotationId): this {
    const lines = this.annotationAdapter.getAnnotation(id)?._render.lines;
    if (!lines) {
      console.warn('No lines found for annotation', id);
      return this;
    }

    const lineElement = lines[0].element;
    if (!lineElement) {
      console.warn('No line element found for annotation', id);
      return this;
    }
    lineElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
    return this;
  }

  addAnnotation(annotation: ANNOTATION): this {
    // TODO not sure if we should check
    if (this.annotationsMap.has(annotation.id)) {
      return this.updateAnnotation(annotation.id, annotation);
    }

    this.annotationsMap.set(annotation.id, annotation);
    this.setAnnotations(this.annotations());
    return this;
  }

  updateAnnotation(id: AnnotationId, annotation: ANNOTATION): this {
    // TODO not sure if we should check
    if (!this.annotationsMap.has(annotation.id)) {
      return this.addAnnotation(annotation);
    }
    this.annotationsMap.set(annotation.id, annotation);
    this.setAnnotations(this.annotations());
    return this;
  }

  deleteAnnotation(id: AnnotationId): this {
    this.annotationsMap.delete(id);
    this.setAnnotations(this.annotations());

    return this;
  }

  setRenderParams(params: Partial<RenderInstances<ANNOTATION>>): this {
    this.annotationModule.inject(RenderInstances).setParams(params);
    this.recalculate();
    return this;
  }

  registerRender<STYLE extends AnnotationRenderStyle>(
    render: AnnotationRender<STYLE>,
  ) {
    this.annotationModule.registerRender(render.name, () => render);

    // TODO check if added later the new render is used in the existing annotations
    return this;
  }

  registerRenders(...renders: AnnotationRender<any>[]) {
    renders.forEach((render) => this.registerRender(render));

    // TODO check if added later the new render is used in the existing annotations
    return this;
  }

  updateRenderStyle<STYLE extends AnnotationRenderStyle>(
    name: string,
    style: Partial<STYLE>,
  ) {
    this.annotationModule.injectRender<STYLE>(name).updateStyle(style);
    // TODO check if updated later the new render is used in the existing annotations
    return this;
  }

  registerStyle(name: string, style: AnnotationStyle) {
    this.annotationModule
      .inject<StyleInstances<ANNOTATION>>(StyleInstances)
      .registerStyle(name, style);
    // TODO check if updated later the new render is used in the existing annotations

    return this;
  }

  setStyleParams(params: Partial<AnnotationStyleParams<ANNOTATION>>): this {
    this.annotationModule
      .inject<StyleInstances<ANNOTATION>>(StyleInstances)
      .setParams(params);
    this.recalculate();
    return this;
  }

  registerStyles(styles: Record<string, AnnotationStyle>) {
    Object.keys(styles).forEach((key) => {
      this.registerStyle(key, styles[key]);
      // this.annotationAdapter.styleInstance.registerStyle(key, styles[key]);
    });
    // TODO check if updated later the new render is used in the existing annotations
    return this;
  }
}
