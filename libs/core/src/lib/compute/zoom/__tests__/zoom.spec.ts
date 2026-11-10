import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  attachZoomControls,
  clampZoom,
  DefaultZoomControls,
  WHEEL_COMMIT_DELAY,
  type ZoomApi,
  type ZoomControlsOptions,
} from '../zoom';

const createApi = (initial = 1, blocked = false) => {
  let zoom = initial;
  const api: ZoomApi = {
    getZoom: () => zoom,
    setZoom: vi.fn((z: number) => {
      zoom = clampZoom(z, DefaultZoomControls);
    }),
    isBlocked: () => blocked,
  };
  return api;
};

const setup = (
  options: Partial<ZoomControlsOptions>,
  initial = 1,
  blocked = false,
) => {
  const wrapper = document.createElement('div');
  document.body.appendChild(wrapper);
  const api = createApi(initial, blocked);
  const controls = attachZoomControls(
    wrapper,
    { ...DefaultZoomControls, ...options },
    api,
  );
  return { wrapper, api, controls };
};

const wheel = (wrapper: HTMLElement, init: WheelEventInit = {}): WheelEvent => {
  const event = new WheelEvent('wheel', {
    cancelable: true,
    clientX: 10,
    clientY: 20,
    ...init,
  });
  wrapper.dispatchEvent(event);
  return event;
};

const key = (wrapper: HTMLElement, init: KeyboardEventInit) => {
  const event = new KeyboardEvent('keydown', { cancelable: true, ...init });
  wrapper.dispatchEvent(event);
  return event;
};

describe('zoom', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  describe('clampZoom', () => {
    it.each`
      zoom   | expected
      ${0.1} | ${0.5}
      ${0.5} | ${0.5}
      ${1.5} | ${1.5}
      ${4}   | ${4}
      ${10}  | ${4}
    `('should clamp $zoom to $expected', ({ zoom, expected }) => {
      expect(clampZoom(zoom, { min: 0.5, max: 4 })).toBe(expected);
    });
  });

  describe('nothing enabled', () => {
    it('should not render buttons or handle events', () => {
      const { wrapper, api } = setup({});

      expect(wrapper.children).toHaveLength(0);
      expect(wrapper.hasAttribute('tabindex')).toBe(false);
      expect(wheel(wrapper, { ctrlKey: true }).defaultPrevented).toBe(false);
      expect(api.setZoom).not.toHaveBeenCalled();
    });
  });

  describe('buttons', () => {
    const buttons = (wrapper: HTMLElement) => {
      const [zoomOut, reset, zoomIn] = Array.from(
        wrapper.querySelectorAll('button'),
      );
      return { zoomOut, reset, zoomIn };
    };

    it('should render a toolbar with zoom out, reset and zoom in', () => {
      const { wrapper } = setup({ buttons: true });

      const toolbar = wrapper.firstElementChild!;
      expect(toolbar.getAttribute('role')).toBe('toolbar');
      const { zoomOut, reset, zoomIn } = buttons(wrapper);
      expect(zoomOut.getAttribute('aria-label')).toBe('Zoom out');
      expect(reset.textContent).toBe('100%');
      expect(reset.getAttribute('aria-live')).toBe('polite');
      expect(zoomIn.getAttribute('aria-label')).toBe('Zoom in');
    });

    it.each`
      name         | initial | expected
      ${'zoomIn'}  | ${1}    | ${1.25}
      ${'zoomOut'} | ${1}    | ${0.75}
      ${'reset'}   | ${2}    | ${1}
    `(
      'should set zoom to $expected when clicking $name at $initial',
      ({ name, initial, expected }) => {
        const { wrapper, api } = setup({ buttons: true }, initial);

        (buttons(wrapper) as Record<string, HTMLButtonElement>)[name].click();

        expect(api.setZoom).toHaveBeenCalledWith(expected, {
          y: expect.any(Number),
        });
      },
    );

    it.each`
      zoom   | label     | outDisabled | inDisabled
      ${0.5} | ${'50%'}  | ${true}     | ${false}
      ${1.5} | ${'150%'} | ${false}    | ${false}
      ${4}   | ${'400%'} | ${false}    | ${true}
    `(
      'should show $label at zoom $zoom',
      ({ zoom, label, outDisabled, inDisabled }) => {
        const { wrapper, controls } = setup({ buttons: true });

        controls.update(zoom);

        const { zoomOut, reset, zoomIn } = buttons(wrapper);
        expect(reset.textContent).toBe(label);
        expect(zoomOut.disabled).toBe(outDisabled);
        expect(zoomIn.disabled).toBe(inDisabled);
      },
    );

    it('should always be left-to-right, whatever the text direction', () => {
      const { wrapper } = setup({ buttons: true });

      expect((wrapper.firstElementChild as HTMLElement).dir).toBe('ltr');
    });

    it('should keep the line next to the clicked button in place', () => {
      const { wrapper, api } = setup({ buttons: true });
      const { zoomIn } = buttons(wrapper);
      vi.spyOn(zoomIn, 'getBoundingClientRect').mockReturnValue(
        DOMRect.fromRect({ x: 100, y: 10, width: 20, height: 30 }),
      );

      zoomIn.click();

      expect(api.setZoom).toHaveBeenCalledWith(1.25, { y: 25 });
    });

    it('should remove the toolbar on destroy', () => {
      const { wrapper, controls } = setup({ buttons: true });

      controls.destroy();

      expect(wrapper.children).toHaveLength(0);
    });
  });

  describe('wheel', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should keep scrolling on a plain wheel', () => {
      const { wrapper, api } = setup({ wheel: true });

      const event = wheel(wrapper, { deltaY: 100 });
      vi.advanceTimersByTime(WHEEL_COMMIT_DELAY);

      expect(event.defaultPrevented).toBe(false);
      expect(api.setZoom).not.toHaveBeenCalled();
    });

    it.each`
      modifier
      ${'ctrlKey'}
      ${'metaKey'}
    `('should zoom with $modifier + wheel', ({ modifier }) => {
      const { wrapper, api } = setup({ wheel: true });

      const event = wheel(wrapper, { deltaY: -100, [modifier]: true });

      expect(event.defaultPrevented).toBe(true);
      expect(wrapper.style.transform).toMatch(/^scale\(1\.2/);
      expect(api.setZoom).not.toHaveBeenCalled();

      vi.advanceTimersByTime(WHEEL_COMMIT_DELAY);

      expect(wrapper.style.transform).toBe('');
      expect(api.setZoom).toHaveBeenCalledWith(expect.closeTo(1.22, 2), {
        x: 10,
        y: 20,
      });
    });

    it('should not zoom the page or the text while blocked', () => {
      const { wrapper, api } = setup({ wheel: true }, 1, true);

      const event = wheel(wrapper, { deltaY: -100, ctrlKey: true });
      vi.advanceTimersByTime(WHEEL_COMMIT_DELAY);

      expect(event.defaultPrevented).toBe(true);
      expect(wrapper.style.transform).toBe('');
      expect(api.setZoom).not.toHaveBeenCalled();
    });

    it('should render once after a burst of wheel events', () => {
      const { wrapper, api } = setup({ wheel: true });

      wheel(wrapper, { deltaY: -100, ctrlKey: true });
      wheel(wrapper, { deltaY: -100, ctrlKey: true, clientX: 99 });
      wheel(wrapper, { deltaY: -100, ctrlKey: true, clientX: 99 });
      vi.advanceTimersByTime(WHEEL_COMMIT_DELAY);

      expect(api.setZoom).toHaveBeenCalledTimes(1);
      // anchor stays where the gesture started
      expect(api.setZoom).toHaveBeenCalledWith(expect.closeTo(1.82, 2), {
        x: 10,
        y: 20,
      });
    });

    it('should not zoom past max', () => {
      const { wrapper, api } = setup({ wheel: true, max: 1.1 });

      wheel(wrapper, { deltaY: -100, ctrlKey: true });
      vi.advanceTimersByTime(WHEEL_COMMIT_DELAY);

      expect(api.setZoom).toHaveBeenCalledWith(1.1, expect.anything());
    });

    it('should zoom with a Safari pinch gesture', () => {
      const { wrapper, api } = setup({ wheel: true });

      const start = new Event('gesturestart', { cancelable: true });
      wrapper.dispatchEvent(start);
      const change = Object.assign(
        new Event('gesturechange', { cancelable: true }),
        { scale: 2, clientX: 1, clientY: 2 },
      );
      wrapper.dispatchEvent(change);
      vi.advanceTimersByTime(WHEEL_COMMIT_DELAY);

      expect(start.defaultPrevented).toBe(true);
      expect(change.defaultPrevented).toBe(true);
      expect(api.setZoom).toHaveBeenCalledWith(2, { x: 1, y: 2 });
    });

    it('should drop a pending zoom on destroy', () => {
      const { wrapper, api, controls } = setup({ wheel: true });

      wheel(wrapper, { deltaY: -100, ctrlKey: true });
      controls.destroy();
      vi.advanceTimersByTime(WHEEL_COMMIT_DELAY);

      expect(wrapper.style.transform).toBe('');
      expect(api.setZoom).not.toHaveBeenCalled();
      expect(wheel(wrapper, { ctrlKey: true }).defaultPrevented).toBe(false);
    });
  });

  describe('keyboard', () => {
    it('should make the wrapper focusable', () => {
      const { wrapper, controls } = setup({ keyboard: true });

      expect(wrapper.tabIndex).toBe(0);

      controls.destroy();

      expect(wrapper.hasAttribute('tabindex')).toBe(false);
    });

    it.each`
      key    | expected
      ${'+'} | ${1.75}
      ${'='} | ${1.75}
      ${'-'} | ${1.25}
      ${'0'} | ${1}
    `('should set zoom to $expected on Ctrl + $key', ({ key: k, expected }) => {
      const { wrapper, api } = setup({ keyboard: true }, 1.5);

      const event = key(wrapper, { key: k, ctrlKey: true });

      expect(event.defaultPrevented).toBe(true);
      expect(api.setZoom).toHaveBeenCalledWith(expected);
    });

    it.each`
      init
      ${{ key: '+' }}
      ${{ key: 'a', ctrlKey: true }}
    `('should ignore $init', ({ init }) => {
      const { wrapper, api } = setup({ keyboard: true });

      const event = key(wrapper, init);

      expect(event.defaultPrevented).toBe(false);
      expect(api.setZoom).not.toHaveBeenCalled();
    });
  });
});
