import { type AnnotationColor } from '../model';

/**
 * Creates an annotation color configuration.
 *
 * @param {string} color - The base color for the annotation.
 * @param {Object} [config] - Optional configuration for the annotation colors.
 * @param {Object} [config.opacity] - Opacity settings for the annotation colors.
 * @param {number} [config.opacity.background=0.3] - Opacity for the background color.
 * @param {number} [config.opacity.border=0.3] - Opacity for the border color.
 * @param {number} [config.opacity.backgroundActive=0.3] - Opacity for the active background color.
 * @param {number} [config.opacity.borderActive=0.9] - Opacity for the active border color.
 * @returns {AnnotationColor} The annotation color configuration.
 */
type Config = {
  opacity?: {
    background?: number;
    border?: number;
    backgroundActive?: number;
    tagBackground?: number;
    borderActive?: number;
    gutter?: number;
  };
};

const defaultConfig: Config = {
  opacity: {
    background: 0.3,
    border: 0.6,
    backgroundActive: 0.8,
    borderActive: 0.9,
    gutter: 0.3,
    tagBackground: 0.1,
  },
};

/**
 * Converts a hex color code to an RGB color.
 *
 * @param {string} hex - The hex color code.
 * @returns {string} The RGB color string.
 */
export const hexToRgb = (hex: string): string => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r},${g},${b}`;
};

/**
 * Creates an annotation color configuration based on the provided color and optional configuration.
 *
 * @param {string} color - The base color in hexadecimal format.
 * @param {Config} [config] - Optional configuration object to override default opacity settings.
 * @returns {AnnotationColor} The generated annotation color configuration.
 */
export const createAnnotationColor = (
  color: string,
  config?: Config,
): AnnotationColor => {
  color = color || '#f51720';
  const opacity = { ...defaultConfig.opacity, ...config?.opacity };
  const rgbColor = hexToRgb(color);

  return {
    border: `rgba(${rgbColor},${opacity.border})`,
    background: `rgba(${rgbColor},${opacity.background})`,
    borderActive: `rgba(${rgbColor},${opacity.borderActive})`,
    backgroundActive: `rgba(${rgbColor},${opacity.backgroundActive})`,
    // backgroundActive: `color-mix(in srgb, white, ${color} ${
    //   opacity.backgroundActive * 100
    // })`,
    gutterColor: `rgba(${rgbColor},${opacity.gutter})`,
    tagColor: 'black',
    tagBackground: `rgba(${rgbColor},${opacity.tagBackground})`,
    color: color,
  };
};

export const getRgbaColor = (color: string, opacity: number): string => {
  if (color === 'transparent') return 'transparent';

  const rgbColor = hexToRgb(color);
  return `rgba(${rgbColor},${opacity})`;
};

export const generateColor = (
  _defaultColor: string,
  _defaultOpacity: number,
  _color?: string,
  _opacity?: number,
) => {
  const color = _color ?? _defaultColor;
  if (color === 'transparent') return 'transparent';

  const rgbColor = hexToRgb(color);
  const opacity = _opacity ?? _defaultOpacity;

  return `rgba(${rgbColor},${opacity})`;
};
/**
 * Creates a set of annotation colors from a given set of color strings.
 *
 * @param colors - A record where the key is a string representing the annotation name and the value is a string representing the color.
 * @returns A record where the key is a string representing the annotation name and the value is an `AnnotationColor` object.
 */
export const createAnnotationColors = (
  colors: Record<string, string>,
  config?: Config,
): Record<string, AnnotationColor> => {
  const colorSet: Record<string, AnnotationColor> = {};

  Object.entries(colors).forEach(([key, value]) => {
    colorSet[key] = createAnnotationColor(value, config);
  });

  return colorSet;
};
