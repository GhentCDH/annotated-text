import { type AnnotatedText } from './CreateAnnotations.model';
import { type TextAnnotationModel } from '../annotation.model';
import { EventListener } from '../../events/event.listener';
import {
  type TEXT_CONFIG_KEYS,
  type TEXT_CONFIG_VALUES,
  type TextAdapter,
} from '../../adapter/text';
import {
  type ANNOTATION_CONFIG_KEYS,
  type ANNOTATION_CONFIG_VALUES,
  type AnnotationAdapter,
} from '../../adapter/annotation';
import { createAnnotationModel } from '../1_create_annotation_model';
import { SvgModel } from '../model/svg.types';
import { Debugger } from '../../utils/debugger';
import { computeLinePositions, computePositions } from '../4_compute_positions';
import { styles } from '../styles.const';
import { computeAnnotationsOnLines } from '../3_compute_annotations_on_line';
import { assignAnnotationsToLines } from '../2_assign_annotation_to_line';
import {
  type AnnotationEventType,
  type ErrorEventCallback,
  type EventCallback,
} from '../../events';
import { drawText } from '../draw/text/text';
import { type Annotation, type AnnotationId } from '../../model';
import { AnnotationColors } from '../model/annotation.colors';
import {
  type AnnotationRender,
  type AnnotationRenderStyle,
} from '../../adapter/annotation/renderer/annotation-render';
import { type AnnotationStyle } from '../../adapter/annotation/style/annotation.style';
import { InternalEventListener } from '../../events/internal/internal.event.listener';

const document = globalThis.document || null;
export type BaseAnnotation = Pick<Annotation, 'id'>;

export class CreateAnnotationsImpl<ANNOTATION extends BaseAnnotation>
  implements AnnotatedText<ANNOTATION>
{
  private textAnnotationModel: TextAnnotationModel | null = null;
  private annotationsMap = new Map<AnnotationId, ANNOTATION>();
  private mainElement: HTMLElement;
  private element: HTMLElement;
  private textElement: HTMLDivElement | null | undefined = null;
  private svgModel: SvgModel;
  private svgNode: SVGElement | null = null;
  private resizeObserver: ResizeObserver | null;
  private text: string;
  private readonly eventListener = new EventListener();
  private readonly internalEventListener = new InternalEventListener();
  private readonly annotationColors = new AnnotationColors();

  constructor(
    private readonly id: string,
    private readonly textAdapter: TextAdapter,
    private readonly annotationAdapter: AnnotationAdapter<ANNOTATION>,
  ) {
    this.init();
    this.annotationAdapter.setConfigListener(this.configListener());
    this.textAdapter.setConfigListener(this.configListener());
    this.internalEventListener.on('annotation--add', ({ data }) => {
      const fullAnnotation = this.annotationAdapter.format(
        data.annotation,
        true,
        true,
      );

      this.addAnnotation(fullAnnotation!);
    });

    this.internalEventListener.on('annotation--update', ({ data }) => {
      const fullAnnotation = this.annotationAdapter.format(
        data.annotation,
        false,
        true,
      );
      this.addAnnotation(fullAnnotation!);
    });
  }

  private configListener() {
    return () => {
      this.recreateAnnotationModel();
    };
  }

  private createAnnotationModel() {
    this.textAnnotationModel = createAnnotationModel(
      this.text,
      this.textAdapter,
      this.annotationAdapter,
    );

    this.textAnnotationModel = assignAnnotationsToLines(
      this.textAnnotationModel,
      this.annotationAdapter,
      this.textAdapter,
      this.annotations(),
      this.eventListener,
    );
    this.textAnnotationModel = computeAnnotationsOnLines(
      this.textAnnotationModel,
    );

    return this;
  }

  private annotations() {
    return Array.from(this.annotationsMap.values());
  }

  public setText(text: string, redraw = true) {
    this.text = text || '';

    this.createAnnotationModel();
    this.setAnnotations(this.annotations(), redraw);

    return this;
  }

  public setAnnotations(annotations: ANNOTATION[], redraw = true) {
    this.annotationsMap.clear();
    annotations.forEach((annotation) => {
      this.annotationsMap.set(annotation.id, annotation);
    });

    if (!this.textAnnotationModel) {
      Debugger.debug(
        'setAnnotations',
        'Annotations set before lines, cannot set annotations',
      );
      return this;
    }

    if (!this.text) {
      Debugger.debug(
        'setAnnotations',
        '------ no lines set, cannot set annotations',
      );
      return this;
    }

    this.createAnnotationModel();

    if (redraw) this.redrawSvg();

    return this;
  }

  public on<EVENT extends AnnotationEventType>(
    event: EVENT,
    callback: EventCallback<EVENT>,
  ) {
    this.eventListener.register(event, callback);
    return this;
  }

  public onError(callback: ErrorEventCallback) {
    this.eventListener.registerError(callback);
    return this;
  }

  private drawText() {
    this.textElement = drawText(
      this.textAnnotationModel!,
      this.textAdapter,
      this.annotationAdapter,
    );

    return this;
  }

  private drawSvg() {
    this.svgModel.drawAnnotations();
    this.annotationColors.color(this.svgModel);
  }

  private init() {
    if (!document) return;
    const id = this.id;
    this.mainElement = document?.getElementById(id) as HTMLDivElement;

    if (this.textElement) {
      this.mainElement.removeChild(this.textElement);
      console.warn('element already initialized, clear and reinitialize');
    }

    const divElement = document.createElement('div');

    this.mainElement.innerHTML = '';
    this.mainElement.appendChild(divElement);

    this.element = divElement;
    if (!this.element) {
      console.error('element not found', id);
      return;
    }

    this.element.innerHTML = '';

    this.element.classList.add(styles.wrapper);

    this.startObserving();

    if (!this.textAnnotationModel) {
      return;
    }
    this.redrawSvg();
  }

  private redrawSvg() {
    if (!document) return;
    // if (!this.textElement) {
    //   console.warn("text element not initialized, cannot redraw svg");
    //   return;
    // }

    if (this.svgNode) {
      this.element?.removeChild(this.svgNode);
    }
    if (this.textElement) {
      this.element?.removeChild(this.textElement);
    }
    this.drawText();

    const textElement = this.textElement!;
    this.element?.append(textElement);
    this.textAnnotationModel = computeLinePositions(
      this.textAnnotationModel!,
      textElement,
    );

    this.textAnnotationModel = computePositions(
      this.textAnnotationModel,
      textElement,
      this.annotationAdapter,
      this.textAdapter,
    );

    this.svgModel = new SvgModel(
      textElement,
      this.textAnnotationModel,
      this.eventListener,
      this.annotationAdapter,
      this.textAdapter,
      this.annotationColors,
      this.internalEventListener,
    );

    this.svgNode = this.svgModel.node();
    this.element?.prepend(this.svgNode!);
    this.drawSvg();
  }

  public destroy() {
    Debugger.debug('CreateAnnotations', 'destroy', this.id);
    this.eventListener.sendEvent('destroy', null, null);

    this.textElement = null;
    this.svgNode = null;
    this.textAnnotationModel = null;

    this.stopObserving();

    return this;
  }

  private startObserving() {
    Debugger.debug(
      'CreateAnnotations',
      'Start observing element',
      this.mainElement,
    );
    if (this.resizeObserver) {
      return;
    }
    let initialized = false;
    this.resizeObserver = new ResizeObserver((entries) => {
      Debugger.verbose('CreateAnnotations', 'resize detected', initialized);
      if (initialized) this.redrawSvg();
      initialized = true;
    });
    if (this.element) {
      Debugger.debug('CreateAnnotations', 'start observing', this.mainElement);

      this.resizeObserver.observe(this.mainElement);
    }
  }

  private stopObserving() {
    if (!this.resizeObserver) {
      return;
    }

    Debugger.debug(
      'CreateAnnotations',
      'Stop observing element',
      this.mainElement,
    );
    if (this.mainElement) {
      this.resizeObserver?.unobserve(this.mainElement);
      this.mainElement.innerHTML = '';
    }
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  public highlightAnnotations(ids: AnnotationId[]) {
    this.annotationColors.highlightAnnotations(ids, this.svgModel);
    return this;
  }

  public selectAnnotations(ids: AnnotationId[]) {
    this.annotationColors.selectAnnotations(ids, this.svgModel);
    return this;
  }

  private recreateAnnotationModel() {
    this.createAnnotationModel();
    this.annotationsMap.clear();
    this.annotations().forEach((annotation) => {
      this.annotationsMap.set(annotation.id, annotation);
    });
    this.redrawSvg();
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
    const lines = this.textAnnotationModel?.getAnnotation(id)?._render.lines;
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
    if (!this.textAnnotationModel) return this;
    const annotation = this.textAnnotationModel.getAnnotation(id);
    this.textAnnotationModel.removeAnnotation(annotation, true);
    this.svgModel.removeAnnotations(annotation.id);
    this.annotationsMap.delete(annotation.id);

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
