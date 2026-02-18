import {
  AnnotationDefaultStyle,
  type CustomAnnotationStyle,
  type DefaultAnnotationStyle,
} from './annotation.style.default';
import { getRgbaColor } from '../../../utils/createAnnotationColor';
import { type AnnotationStyle } from '../../../model';

const getStyles = (...styles: Array<DefaultAnnotationStyle>) => {
  const getValue = <K extends keyof DefaultAnnotationStyle>(
    key: K,
  ): DefaultAnnotationStyle[K] => {
    for (const style of styles) {
      const value = style?.[key];
      if (value !== undefined) {
        return value as DefaultAnnotationStyle[K];
      }
    }
    throw new Error(`value not found ${key as string}`);
  };

  const generateColor = (
    colorKey: keyof DefaultAnnotationStyle,
    opacityKey: keyof DefaultAnnotationStyle,
  ) => {
    const color = getValue(colorKey) as string;
    const opacity = getValue(opacityKey) as number;
    return getRgbaColor(color, opacity ?? 1);
  };

  return { generateColor, getValue };
};
export const getAnnotationStyle = (
  defaultStyle: CustomAnnotationStyle,
  style: CustomAnnotationStyle,
): AnnotationStyle => {
  const generateColors = (KEY: keyof CustomAnnotationStyle) => {
    const styles = getStyles(
      style?.[KEY] ?? ({} as any),
      defaultStyle?.[KEY] ?? ({} as any),
      AnnotationDefaultStyle[KEY] ?? ({} as any),
      AnnotationDefaultStyle.default ?? ({} as any),
    );

    return {
      backgroundColor: styles.generateColor(
        'backgroundColor',
        'backgroundOpacity',
      ),
      borderColor: styles.generateColor('borderColor', 'borderOpacity'),
      borderWidth: styles.getValue('borderWidth'),
      borderRadius: styles.getValue('borderRadius'),
      // gutter
      width: styles.getValue('width'),
      gap: styles.getValue('gap'),
      // Tag
      tagTextColor: styles.getValue('tagTextColor'),
      tagBackgroundColor: styles.generateColor(
        'tagBackgroundColor',
        'tagBackgroundOpacity',
      ),
      tagBorderColor: styles.generateColor(
        'tagBorderColor',
        'tagBorderOpacity',
      ),
      tagBorderWidth: styles.getValue('tagBorderWidth'),
    };
  };

  return {
    default: generateColors('default'),
    edit: generateColors('edit'),
    hover: generateColors('hover'),
    active: generateColors('active'),
  };
};

export type StyleFn<ANNOTATION> = (
  annotation: ANNOTATION,
) => string | CustomAnnotationStyle | null;

export const DEFAULT_STYLE_NAME = 'DEFAULT';
export const DefaultAnnotationStyleParams = {
  styleFn: (annotation: any): string | CustomAnnotationStyle | null => null,
  defaultStyle: DEFAULT_STYLE_NAME,
};

/**
 * Configuration parameters for the {@link StyleInstances} class.
 *
 * @typeParam ANNOTATION - The type of annotation objects this configuration handles
 *
 * @property styleFn - A function that determines the style for a given annotation.
 *   Can return:
 *   - `string` - A named style key to look up in the style registry
 *   - `AnnotationStyle` - A direct style object to use
 *   - `null` - Use the default style
 * @property defaultStyle - The fallback style used when `styleFn` returns `null`
 *   or when a named style is not found in the registry
 */
export type AnnotationStyleParams<ANNOTATION> =
  typeof DefaultAnnotationStyleParams & {
    styleFn: StyleFn<ANNOTATION>;
  };
