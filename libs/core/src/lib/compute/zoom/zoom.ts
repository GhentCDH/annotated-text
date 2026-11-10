import { styles } from '../styles.const';

export type ZoomControlsOptions = {
  /** Render − / % / + buttons on top of the text */
  buttons: boolean;
  /** Zoom with Ctrl/Cmd + mouse wheel and trackpad pinch over the text */
  wheel: boolean;
  /** Zoom with Ctrl/Cmd + '+' / '-' / '0' while the text has focus */
  keyboard: boolean;
  min: number;
  max: number;
  /** Zoom step used by the buttons and the keyboard */
  step: number;
};

export const DefaultZoomControls: ZoomControlsOptions = {
  buttons: false,
  wheel: false,
  keyboard: false,
  min: 0.5,
  max: 4,
  step: 0.25,
};

type Point = { x: number; y: number };

/**
 * Viewport point whose text stays in place while zooming. With `x` the character
 * at that point stays put; without it the start of the line at `y` does, which
 * doesn't move when the line wraps differently at the new zoom.
 */
export type ZoomAnchor = { x?: number; y: number };

export type ZoomApi = {
  getZoom: () => number;
  setZoom: (zoom: number, anchor?: ZoomAnchor) => void;
  /** True while zooming is not allowed, e.g. during an annotation drag or edit */
  isBlocked: () => boolean;
};

export type ZoomControls = {
  update: (zoom: number) => void;
  destroy: () => void;
};

/** Wait this long after the last wheel/pinch event before re-rendering */
export const WHEEL_COMMIT_DELAY = 150;

export const clampZoom = (
  zoom: number,
  { min, max }: Pick<ZoomControlsOptions, 'min' | 'max'>,
) => Math.min(max, Math.max(min, zoom));

/** Round to avoid 1.2500000001 % labels and zoom levels that never hit min/max */
const round = (zoom: number) => Math.round(zoom * 100) / 100;

export const getScrollParent = (element: HTMLElement): HTMLElement => {
  for (let el = element.parentElement; el; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    if (/auto|scroll/.test(overflowY) && el.scrollHeight > el.clientHeight) {
      return el;
    }
  }
  return (document.scrollingElement ?? document.documentElement) as HTMLElement;
};

/** Center of the part of the element that is visible in its scroll box and the viewport */
export const getVisibleCenter = (element: HTMLElement): Point => {
  const rect = element.getBoundingClientRect();
  const scrollParent = getScrollParent(element);
  const box =
    scrollParent === document.scrollingElement
      ? { top: 0, bottom: window.innerHeight }
      : scrollParent.getBoundingClientRect();

  const top = Math.max(rect.top, box.top, 0);
  const bottom = Math.min(rect.bottom, box.bottom, window.innerHeight);

  return { x: rect.left + rect.width / 2, y: (top + bottom) / 2 };
};

const createButton = (
  label: string,
  text: string,
  onClick: (anchor: ZoomAnchor) => void,
) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  if (label) button.setAttribute('aria-label', label);
  button.addEventListener('click', () => {
    // Keep the line next to the toolbar in place, so the toolbar doesn't jump away
    const rect = button.getBoundingClientRect();
    onClick({ y: rect.top + rect.height / 2 });
  });
  return button;
};

const createToolbar = (options: ZoomControlsOptions, api: ZoomApi) => {
  const toolbar = document.createElement('div');
  toolbar.className = styles.zoom;
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Zoom');
  // Same place (top right) and button order (− % +) whatever the text direction
  toolbar.dir = 'ltr';

  const zoomBy = (step: number, anchor: ZoomAnchor) =>
    api.setZoom(round(api.getZoom() + step), anchor);

  const zoomOut = createButton('Zoom out', '−', (anchor) =>
    zoomBy(-options.step, anchor),
  );
  // No aria-label: the percentage is the accessible name and is announced on change
  const reset = createButton('', '100%', (anchor) => api.setZoom(1, anchor));
  reset.title = 'Reset zoom';
  reset.setAttribute('aria-live', 'polite');
  const zoomIn = createButton('Zoom in', '+', (anchor) =>
    zoomBy(options.step, anchor),
  );

  toolbar.append(zoomOut, reset, zoomIn);

  const update = (zoom: number) => {
    reset.textContent = `${Math.round(zoom * 100)}%`;
    zoomOut.disabled = zoom <= options.min;
    zoomIn.disabled = zoom >= options.max;
  };

  return { toolbar, update };
};

/**
 * Attach zoom buttons, mouse wheel / pinch and keyboard zoom to the wrapper.
 *
 * Wheel and pinch show an instant css `transform: scale()` preview (annotations
 * follow, see `getUnscaledRect`) and only re-render once the gesture stops.
 */
export const attachZoomControls = (
  wrapper: HTMLElement,
  options: ZoomControlsOptions,
  api: ZoomApi,
): ZoomControls => {
  const cleanup: (() => void)[] = [];
  const listen = <K extends keyof HTMLElementEventMap>(
    type: K | 'gesturestart' | 'gesturechange',
    handler: (event: any) => void,
  ) => {
    wrapper.addEventListener(type, handler, { passive: false });
    cleanup.push(() => wrapper.removeEventListener(type, handler));
  };

  let update: ZoomControls['update'] = () => undefined;

  if (options.buttons) {
    const toolbar = createToolbar(options, api);
    wrapper.prepend(toolbar.toolbar);
    update = toolbar.update;
    cleanup.push(() => toolbar.toolbar.remove());
  }

  if (options.wheel) {
    let pending: { zoom: number; anchor: Point } | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const commit = () => {
      if (!pending) return;
      const { zoom, anchor } = pending;
      pending = null;
      wrapper.style.transform = '';
      wrapper.style.transformOrigin = '';
      api.setZoom(zoom, anchor);
    };

    const preview = (zoom: number, anchor: Point) => {
      if (!pending) {
        // Origin is measured once, before any transform is applied
        const rect = wrapper.getBoundingClientRect();
        wrapper.style.transformOrigin = `${anchor.x - rect.left}px ${anchor.y - rect.top}px`;
      }
      pending = { zoom, anchor: pending?.anchor ?? anchor };
      wrapper.style.transform = `scale(${zoom / api.getZoom()})`;
      clearTimeout(timer);
      timer = setTimeout(commit, WHEEL_COMMIT_DELAY);
    };

    listen('wheel', (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return; // plain wheel keeps scrolling
      event.preventDefault(); // don't zoom the whole page
      if (api.isBlocked()) return;
      const current = pending?.zoom ?? api.getZoom();
      // Mouse wheel ticks are ~100, trackpad pinch deltas are small: both feel natural
      const delta = Math.max(-100, Math.min(100, event.deltaY));
      const zoom = clampZoom(current * Math.exp(-delta * 0.002), options);
      preview(zoom, { x: event.clientX, y: event.clientY });
    });

    // Safari sends pinch as non-standard gesture events instead of ctrl + wheel
    let gestureStartZoom = 1;
    listen('gesturestart', (event) => {
      event.preventDefault();
      gestureStartZoom = pending?.zoom ?? api.getZoom();
    });
    listen('gesturechange', (event) => {
      event.preventDefault();
      if (api.isBlocked()) return;
      const zoom = clampZoom(gestureStartZoom * event.scale, options);
      preview(zoom, { x: event.clientX, y: event.clientY });
    });

    cleanup.push(() => {
      clearTimeout(timer);
      pending = null;
      wrapper.style.transform = '';
      wrapper.style.transformOrigin = '';
    });
  }

  if (options.keyboard) {
    const tabIndex = wrapper.getAttribute('tabindex');
    if (tabIndex === null) wrapper.tabIndex = 0;

    listen('keydown', (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      const zoom = api.getZoom();
      const next =
        event.key === '+' || event.key === '='
          ? zoom + options.step
          : event.key === '-'
            ? zoom - options.step
            : event.key === '0'
              ? 1
              : null;
      if (next === null) return;
      event.preventDefault();
      api.setZoom(round(next));
    });

    cleanup.push(() => {
      if (tabIndex === null) wrapper.removeAttribute('tabindex');
    });
  }

  return {
    update,
    destroy: () => cleanup.forEach((fn) => fn()),
  };
};
