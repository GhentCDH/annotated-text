import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AnnotationRenderStyle } from '../annotation-render.style';
import { getAnnotationStyle } from '../annotation.style';
import type { CustomAnnotationStyle } from '../annotation.style.default';
import { Debugger } from '../../../../utils/debugger';

vi.mock('../../../../utils/debugger', () => ({
  Debugger: {
    verbose: vi.fn(),
    warn: vi.fn(),
  },
}));

interface TestAnnotation {
  id: string;
  type: string;
}

const redStyle: CustomAnnotationStyle = {
  default: { backgroundColor: '#ff0000', backgroundOpacity: 0.5 },
};

const blueStyle: CustomAnnotationStyle = {
  default: { backgroundColor: '#0000ff', backgroundOpacity: 0.8 },
};

const greenStyle: CustomAnnotationStyle = {
  default: { backgroundColor: '#00ff00', backgroundOpacity: 0.6 },
  hover: { backgroundColor: '#00cc00' },
};

describe('AnnotationRenderStyle', () => {
  let renderStyle: AnnotationRenderStyle<TestAnnotation>;

  beforeEach(() => {
    vi.clearAllMocks();
    renderStyle = new AnnotationRenderStyle<TestAnnotation>();
  });

  describe('constructor', () => {
    it('should register DEFAULT style on creation', () => {
      const style = renderStyle.getDefaultStyle();

      expect(style).toBeDefined();
      expect(style).toHaveProperty('default');
      expect(style).toHaveProperty('edit');
      expect(style).toHaveProperty('hover');
      expect(style).toHaveProperty('active');
    });

    it('should apply custom defaultStyle to the DEFAULT entry', () => {
      const custom = new AnnotationRenderStyle<TestAnnotation>(redStyle);
      const expected = getAnnotationStyle({}, redStyle);

      expect(custom.getDefaultStyle()).toEqual(expected);
    });
  });

  describe('registerStyle', () => {
    it('should make a named style retrievable via styleFn', () => {
      renderStyle.registerStyle('red', redStyle);
      renderStyle.setStyleFn((ann) => ann.type);

      const result = renderStyle.getStyle({ id: '1', type: 'red' });

      expect(result).toEqual(getAnnotationStyle({}, redStyle));
    });

    it('should overwrite a previously registered style', () => {
      renderStyle.registerStyle('color', redStyle);
      renderStyle.registerStyle('color', blueStyle);
      renderStyle.setStyleFn((ann) => ann.type);

      const result = renderStyle.getStyle({ id: '1', type: 'color' });

      expect(result).toEqual(getAnnotationStyle({}, blueStyle));
    });

    it.each`
      name         | style
      ${'red'}     | ${redStyle}
      ${'blue'}    | ${blueStyle}
      ${'green'}   | ${greenStyle}
    `(
      'should compute AnnotationStyle for "$name" using defaultStyle as base',
      ({ name, style }) => {
        const customDefault = redStyle;
        const withDefault = new AnnotationRenderStyle<TestAnnotation>(customDefault);

        withDefault.registerStyle(name, style);
        withDefault.setStyleFn(() => name);

        const result = withDefault.getStyle({ id: '1', type: 'test' });

        expect(result).toEqual(getAnnotationStyle(customDefault, style));
      },
    );
  });

  describe('getDefaultStyle', () => {
    it('should return the DEFAULT style when no custom default name is set', () => {
      const defaultStyle = renderStyle.getDefaultStyle();

      expect(defaultStyle).toEqual(getAnnotationStyle({}, {}));
    });

    it('should return the named default when setDefaultStyleName is called', () => {
      renderStyle.registerStyle('blue', blueStyle);
      renderStyle.setDefaultStyleName('blue');

      expect(renderStyle.getDefaultStyle()).toEqual(
        getAnnotationStyle({}, blueStyle),
      );
    });

    it('should fall back to DEFAULT when defaultStyleName is not found', () => {
      renderStyle.setDefaultStyleName('nonexistent');

      expect(renderStyle.getDefaultStyle()).toEqual(
        getAnnotationStyle({}, {}),
      );
    });
  });

  describe('setDefaultStyleName', () => {
    it('should update the default style when name exists', () => {
      renderStyle.registerStyle('green', greenStyle);
      renderStyle.setDefaultStyleName('green');

      expect(renderStyle.getDefaultStyle()).toEqual(
        getAnnotationStyle({}, greenStyle),
      );
    });

    it('should warn and keep current default when name does not exist', () => {
      const before = renderStyle.getDefaultStyle();
      renderStyle.setDefaultStyleName('unknown');
      const after = renderStyle.getDefaultStyle();

      expect(Debugger.warn).toHaveBeenCalledWith(
        expect.stringContaining('unknown'),
      );
      expect(after).toEqual(before);
    });
  });

  describe('getStyle', () => {
    describe('when annotation is null', () => {
      it('should return the default style', () => {
        expect(renderStyle.getStyle(null)).toEqual(
          renderStyle.getDefaultStyle(),
        );
      });
    });

    describe('when styleFn returns null', () => {
      it('should return the default style', () => {
        renderStyle.setStyleFn(() => null);

        const result = renderStyle.getStyle({ id: '1', type: 'test' });

        expect(result).toEqual(renderStyle.getDefaultStyle());
      });
    });

    describe('when styleFn returns a string', () => {
      it.each`
        name         | style
        ${'red'}     | ${redStyle}
        ${'blue'}    | ${blueStyle}
        ${'green'}   | ${greenStyle}
      `(
        'should return registered "$name" style',
        ({ name, style }) => {
          renderStyle.registerStyle(name, style);
          renderStyle.setStyleFn((ann) => ann.type);

          const result = renderStyle.getStyle({ id: '1', type: name });

          expect(result).toEqual(getAnnotationStyle({}, style));
        },
      );

      it('should return defaultStyle object when named style is not found', () => {
        renderStyle.setStyleFn(() => 'nonexistent');

        const result = renderStyle.getStyle({ id: '1', type: 'test' });

        expect(Debugger.warn).toHaveBeenCalledWith(
          expect.stringContaining('nonexistent'),
        );
        // Falls back to this.defaultStyle (the raw CustomAnnotationStyle)
        expect(result).toEqual({});
      });
    });

    describe('when styleFn returns a CustomAnnotationStyle', () => {
      it('should compute and return the style directly', () => {
        renderStyle.setStyleFn(() => blueStyle);

        const result = renderStyle.getStyle({ id: '1', type: 'test' });

        expect(result).toEqual(getAnnotationStyle({}, blueStyle));
      });

      it('should use defaultStyle as base for inline styles', () => {
        const withDefault = new AnnotationRenderStyle<TestAnnotation>(redStyle);
        withDefault.setStyleFn(() => greenStyle);

        const result = withDefault.getStyle({ id: '1', type: 'test' });

        expect(result).toEqual(getAnnotationStyle(redStyle, greenStyle));
      });
    });

    describe('dynamic style resolution', () => {
      it.each`
        type           | expectedStyle
        ${'red'}       | ${redStyle}
        ${'blue'}      | ${blueStyle}
        ${'inline'}    | ${greenStyle}
        ${'unknown'}   | ${null}
      `(
        'should resolve "$type" annotation to correct style',
        ({ type, expectedStyle }) => {
          renderStyle.registerStyle('red', redStyle);
          renderStyle.registerStyle('blue', blueStyle);
          renderStyle.setStyleFn((ann) => {
            if (ann.type === 'inline') return greenStyle;
            if (ann.type === 'unknown') return null;
            return ann.type;
          });

          const result = renderStyle.getStyle({ id: '1', type });

          if (expectedStyle === null) {
            expect(result).toEqual(renderStyle.getDefaultStyle());
          } else {
            expect(result).toEqual(getAnnotationStyle({}, expectedStyle));
          }
        },
      );
    });
  });

  describe('updateDefaultStyle', () => {
    it('should merge new properties into the defaultStyle', () => {
      const instance = new AnnotationRenderStyle<TestAnnotation>(redStyle);
      instance.updateDefaultStyle({
        default: { borderColor: '#00ff00' },
      });
      instance.setStyleFn(() => ({}));

      const result = instance.getStyle({ id: '1', type: 'test' });

      // backgroundColor from redStyle, borderColor from update
      expect(result.default.backgroundColor).toContain('255,0,0');
      expect(result.default.borderColor).toContain('0,255,0');
    });

    it('should not affect already registered styles', () => {
      const instance = new AnnotationRenderStyle<TestAnnotation>();
      instance.registerStyle('blue', blueStyle);

      const before = instance.getStyle(null);
      instance.updateDefaultStyle(redStyle);

      // Registered 'blue' style was computed at register time, not affected
      instance.setStyleFn(() => 'blue');
      const blueResult = instance.getStyle({ id: '1', type: 'test' });

      expect(blueResult).toEqual(getAnnotationStyle({}, blueStyle));
    });
  });
});
