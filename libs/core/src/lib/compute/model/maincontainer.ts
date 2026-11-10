import { Debugger } from '../../utils/debugger';
import { type AnnotationModule } from '../../di/annotation.module';
import { InternalEventListener } from '../../events/internal/internal.event.listener';
import { styles } from '../styles.const';

export class MainContainer {
  private mainElement: HTMLElement;
  private element: HTMLElement;
  private textElement: HTMLDivElement | null | undefined = null;

  private resizeObserver: ResizeObserver | null = null;
  private prevSvgNode: SVGElement | null = null;

  private readonly internalEventListener: InternalEventListener;

  constructor(private readonly annotationModule: AnnotationModule) {
    this.internalEventListener = this.annotationModule.inject(
      InternalEventListener,
    );
  }

  /** The wrapper holding the svg and text, null before the main element is set */
  get wrapper(): HTMLElement | null {
    return this.element ?? null;
  }

  setMainElement(mainElement: HTMLElement) {
    this.mainElement = mainElement;

    if (this.textElement) {
      this.mainElement.removeChild(this.textElement);
      Debugger.warn('element already initialized, clear and reinitialize');
    }

    const divElement = document.createElement('div');

    this.mainElement.innerHTML = '';
    this.mainElement.appendChild(divElement);

    this.element = divElement;

    this.element.innerHTML = '';

    this.element.classList.add(styles.wrapper);
    this.startObserving();
  }

  clear() {
    if (this.prevSvgNode) {
      this.element?.removeChild(this.prevSvgNode);
    }
    if (this.textElement) {
      this.element?.removeChild(this.textElement);
    }
  }

  setTextElement(textElement: HTMLDivElement) {
    this.textElement = textElement;
    this.element?.append(textElement);
  }

  setSvg(element: SVGElement | null) {
    this.prevSvgNode = element;
    if (!element) {
      return;
    }

    this.element?.prepend(element);
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
    // Only width changes reflow the text. Height changes are caused by our own
    // redraw (or zoom, which redraws itself) and would trigger a second redraw.
    let width: number | null = null;
    this.resizeObserver = new ResizeObserver((entries) => {
      const newWidth = entries[entries.length - 1]?.contentRect.width ?? null;
      Debugger.verbose('CreateAnnotations', 'resize detected', newWidth);
      if (width !== null && newWidth !== width)
        this.internalEventListener.sendEvent('redraw-svg', undefined);
      width = newWidth;
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

  destroy() {
    this.textElement = null;
    this.prevSvgNode = null;
    this.stopObserving();
  }
}
