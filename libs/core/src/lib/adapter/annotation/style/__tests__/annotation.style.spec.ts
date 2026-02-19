import { describe, expect, it } from 'vitest';
import {
  DEFAULT_STYLE_NAME,
  DefaultAnnotationStyleParams,
  getAnnotationStyle,
} from '../annotation.style';
import type { CustomAnnotationStyle } from '../annotation.style.default';

// Pre-computed rgba values from built-in defaults
const rgba = {
  red03: 'rgba(255,59,59,0.3)',
  red06: 'rgba(255,59,59,0.6)',
  grey09: 'rgba(204,204,204,0.9)',
  white01: 'rgba(255,255,255,0.1)',
  black: 'rgba(0,0,0,0.3)', // fallback opacity from default
} as const;

describe('getAnnotationStyle', () => {
  describe('with empty styles', () => {
    const result = getAnnotationStyle({}, {});

    it('should return all four states', () => {
      expect(result).toHaveProperty('default');
      expect(result).toHaveProperty('edit');
      expect(result).toHaveProperty('hover');
      expect(result).toHaveProperty('active');
    });

    it('should use built-in defaults for the default state', () => {
      expect(result.default).toEqual({
        backgroundColor: rgba.red03,
        borderColor: rgba.red06,
        borderWidth: 2,
        borderRadius: 6,
        gutterWidth: 3,
        gutterGap: 6,
        tagTextColor: '#000000',
        tagBackgroundColor: rgba.white01,
        tagBorderColor: rgba.red06,
        tagBorderWidth: 1,
      });
    });
  });

  describe('style cascade priority', () => {
    it('should prefer style over defaultStyle', () => {
      const defaultStyle: CustomAnnotationStyle = {
        default: { backgroundColor: '#00ff00', backgroundOpacity: 0.5 },
      };
      const style: CustomAnnotationStyle = {
        default: { backgroundColor: '#0000ff', backgroundOpacity: 0.8 },
      };

      const result = getAnnotationStyle(defaultStyle, style);

      expect(result.default.backgroundColor).toBe('rgba(0,0,255,0.8)');
    });

    it('should fall back to defaultStyle when style does not define a property', () => {
      const defaultStyle: CustomAnnotationStyle = {
        default: { backgroundColor: '#00ff00', backgroundOpacity: 0.5 },
      };
      const style: CustomAnnotationStyle = {
        default: {},
      };

      const result = getAnnotationStyle(defaultStyle, style);

      expect(result.default.backgroundColor).toBe('rgba(0,255,0,0.5)');
    });

    it('should fall back to AnnotationDefaultStyle when neither style nor defaultStyle define a property', () => {
      const result = getAnnotationStyle({}, {});

      expect(result.default.borderWidth).toBe(2);
      expect(result.default.borderRadius).toBe(6);
    });
  });

  describe('color generation', () => {
    it.each`
      hex          | opacity | expected
      ${'#ff0000'} | ${1}    | ${'rgba(255,0,0,1)'}
      ${'#00ff00'} | ${0.5}  | ${'rgba(0,255,0,0.5)'}
      ${'#0000ff'} | ${0}    | ${'rgba(0,0,255,0)'}
      ${'#ffffff'} | ${0.3}  | ${'rgba(255,255,255,0.3)'}
      ${'#000000'} | ${1}    | ${'rgba(0,0,0,1)'}
    `(
      'should convert $hex with opacity $opacity to $expected',
      ({ hex, opacity, expected }) => {
        const style: CustomAnnotationStyle = {
          default: { backgroundColor: hex, backgroundOpacity: opacity },
        };

        const result = getAnnotationStyle({}, style);

        expect(result.default.backgroundColor).toBe(expected);
      },
    );

    it('should return "transparent" for transparent color', () => {
      const style: CustomAnnotationStyle = {
        default: { backgroundColor: 'transparent' },
      };

      const result = getAnnotationStyle({}, style);

      expect(result.default.backgroundColor).toBe('transparent');
    });
  });

  describe('state-specific overrides', () => {
    it.each`
      state        | overrides
      ${'hover'}   | ${{ backgroundColor: '#00ff00', backgroundOpacity: 0.7 }}
      ${'edit'}    | ${{ borderColor: '#0000ff', borderOpacity: 0.9 }}
      ${'active'}  | ${{ backgroundOpacity: 0.9 }}
    `(
      'should apply $state overrides',
      ({ state, overrides }) => {
        const style: CustomAnnotationStyle = {
          [state]: overrides,
        };

        const result = getAnnotationStyle({}, style);

        if (overrides.backgroundColor && overrides.backgroundOpacity) {
          expect(result[state as keyof typeof result].backgroundColor).toContain(
            `${overrides.backgroundOpacity}`,
          );
        }
        if (overrides.borderColor && overrides.borderOpacity) {
          expect(result[state as keyof typeof result].borderColor).toContain(
            `${overrides.borderOpacity}`,
          );
        }
      },
    );

    it('should fall back to AnnotationDefaultStyle.default for unset state properties', () => {
      const style: CustomAnnotationStyle = {
        hover: { backgroundColor: '#00ff00' },
      };

      const result = getAnnotationStyle({}, style);

      // borderRadius is not in hover defaults, falls back to AnnotationDefaultStyle.default
      expect(result.hover.borderRadius).toBe(6);
      expect(result.hover.tagBorderWidth).toBe(1);
    });
  });

  describe('combined defaultStyle and style', () => {
    it('should merge defaultStyle and style across all states', () => {
      const defaultStyle: CustomAnnotationStyle = {
        default: { backgroundColor: '#111111', backgroundOpacity: 0.4 },
        hover: { backgroundColor: '#222222' },
      };
      const style: CustomAnnotationStyle = {
        default: { borderColor: '#333333', borderOpacity: 0.8 },
        hover: { borderColor: '#444444' },
      };

      const result = getAnnotationStyle(defaultStyle, style);

      // default: style borderColor + defaultStyle backgroundColor
      expect(result.default.borderColor).toBe('rgba(51,51,51,0.8)');
      expect(result.default.backgroundColor).toBe('rgba(17,17,17,0.4)');

      // hover: style borderColor + defaultStyle backgroundColor
      expect(result.hover.borderColor).toContain('68,68,68');
      expect(result.hover.backgroundColor).toContain('34,34,34');
    });

    it('should produce valid style for all states when only default is customized', () => {
      const style: CustomAnnotationStyle = {
        default: { backgroundColor: '#abcdef', backgroundOpacity: 0.5 },
      };

      const result = getAnnotationStyle({}, style);

      // All states should have the required shape
      for (const state of ['default', 'edit', 'hover', 'active'] as const) {
        expect(result[state]).toHaveProperty('backgroundColor');
        expect(result[state]).toHaveProperty('borderColor');
        expect(result[state]).toHaveProperty('borderWidth');
        expect(result[state]).toHaveProperty('borderRadius');
        expect(result[state]).toHaveProperty('gutterWidth');
        expect(result[state]).toHaveProperty('gutterGap');
        expect(result[state]).toHaveProperty('tagTextColor');
        expect(result[state]).toHaveProperty('tagBackgroundColor');
        expect(result[state]).toHaveProperty('tagBorderColor');
        expect(result[state]).toHaveProperty('tagBorderWidth');
      }
    });
  });

  describe('DefaultAnnotationStyleParams', () => {
    it('should have DEFAULT as the defaultStyle name', () => {
      expect(DefaultAnnotationStyleParams.defaultStyle).toBe(DEFAULT_STYLE_NAME);
    });

    it('should have a styleFn that returns null', () => {
      expect(DefaultAnnotationStyleParams.styleFn({ any: 'annotation' })).toBeNull();
    });
  });
});
