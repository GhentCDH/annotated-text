import { type AnnotatedText } from './CreateAnnotations.model';
import { EventListener } from '../../events/event.listener';
import { type TEXT_CONFIG_KEYS, type TEXT_CONFIG_VALUES, type TextAdapter } from '../../adapter/text';
import {
  type ANNOTATION_CONFIG_KEYS,
  type ANNOTATION_CONFIG_VALUES,
  type AnnotationAdapter
} from '../../adapter/annotation';
import { SvgModel } from '../model/svg.types';
import { Debugger } from '../../utils/debugger';
import { type AnnotationEventType, type ErrorEventCallback, type EventCallback } from '../../events';
import { type AnnotationId, type BaseAnnotation } from '../../model';
import { type AnnotationRender, type AnnotationRenderStyle } from '../../adapter/annotation/renderer';
import { type AnnotationStyle } from '../../adapter/annotation/style';
import { InternalEventListener } from '../../events/internal/internal.event.listener';
import { AnnotationModule } from '../../di/annotation.module';
import { rootContainer } from '../../di/container';
import { Draw } from '../draw/Draw';
import { ExternalEventSender } from '../../events/send-event';
import { MainContainer } from '../model/maincontainer';

const document = globalThis.document || null;

export class CreateAnnotationsImpl<ANNOTATION extends BaseAnnotation>
  implements AnnotatedText<ANNOTATION>
{
  private annotationsMap = new Map<AnnotationId, ANNOTATION>();
  private readonly svgModel: SvgModel;
  private readonly draw: Draw<ANNOTATION>;
  private text: string;
  private readonly eventListener: EventListener<ANNOTATION>;

  private readonly annotationModule: AnnotationModule;
  private readonly mainContainer: MainContainer;

  constructor(
    private readonly id: string,
    private readonly textAdapter: TextAdapter,
    private readonly annotationAdapter: AnnotationAdapter<ANNOTATION>,
  ) {
    this.annotationModule = new AnnotationModule(rootContainer, {
      textAdapter,
      annotationAdapter,
    });

    this.svgModel = this.annotationModule.inject(SvgModel);
    this.mainContainer = this.annotationModule.inject(MainContainer);
    this.draw = this.annotationModule.inject<Draw<ANNOTATION>>(Draw);

    const internalEventListener = this.annotationModule.inject(
      InternalEventListener,
    );

    annotationAdapter.setConfigListener(this.configListener());
    textAdapter.setConfigListener(this.configListener());

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
      });
  }

  private configListener() {
    return () => {
      this.setAnnotations(this.annotations());
    };
  }

  private annotations() {
    return Array.from(this.annotationsMap.values());
  }

  public setText(text: string, redraw = true) {
    this.text = text || '';
    this.draw.initDraw(this.text, this.annotations());
    this.setAnnotations(this.annotations(), redraw);

    return this;
  }

  public setAnnotations(annotations: ANNOTATION[], redraw = true) {
    this.annotationsMap.clear();
    annotations.forEach((annotation) => {
      this.annotationsMap.set(annotation.id, annotation);
    });

    if (!this.text) {
      Debugger.debug(
        'setAnnotations',
        '------ no lines set, cannot set annotations',
      );
      return this;
    }

    this.draw.initDraw(this.text, this.annotations());

    if (redraw) this.redrawSvg();

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

    const textElement = this.draw.text.draw()!;

    this.mainContainer.setTextElement(textElement);

    this.draw.compute(textElement);

    this.svgModel.createModel(textElement);

    this.mainContainer.setSvg(this.svgModel.node());

    this.draw.annotation.drawAll();
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

  changeTextAdapterConfig<KEY extends TEXT_CONFIG_KEYS>(
    key: KEY,
    value: TEXT_CONFIG_VALUES<KEY>,
  ): this {
    this.textAdapter.setConfig(key, value);
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

  registerRender<STYLE extends AnnotationRenderStyle>(
    render: AnnotationRender<STYLE>,
  ) {
    this.annotationAdapter.renderInstance.registerRender(render);

    // TODO check if added later the new render is used in the existing annotations
    return this;
  }

  registerRenders(...renders: AnnotationRender<any>[]) {
    renders.forEach((render) =>
      this.annotationAdapter.renderInstance.registerRender(render),
    );

    // TODO check if added later the new render is used in the existing annotations
    return this;
  }

  updateRenderStyle<STYLE extends AnnotationRenderStyle>(
    name: string,
    style: Partial<STYLE>,
  ) {
    this.annotationAdapter.renderInstance.updateRenderStyle(name, style);
    // TODO check if updated later the new render is used in the existing annotations
    return this;
  }

  registerStyle(name: string, style: AnnotationStyle) {
    this.annotationAdapter.styleInstance.registerStyle(name, style);
    // TODO check if updated later the new render is used in the existing annotations

    return this;
  }

  registerStyles(styles: Record<string, AnnotationStyle>) {
    Object.keys(styles).forEach((key) => {
      this.annotationAdapter.styleInstance.registerStyle(key, styles[key]);
    });
    // TODO check if updated later the new render is used in the existing annotations
    return this;
  }
}
