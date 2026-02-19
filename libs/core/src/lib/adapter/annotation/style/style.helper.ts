import {
  _DefaultAnnotationStyle,
  DefaultAnnotationStyle,
} from './annotation.style.default';

export const createUnderlineStyle = (
  color: string,
  style: Partial<DefaultAnnotationStyle> = {},
): Partial<DefaultAnnotationStyle> => ({
  ..._DefaultAnnotationStyle,
  backgroundColor: 'transparent',
  borderColor: color,
  tagBorderColor: color,
  ...style,
});

export const createGutterStyle = (
  color: string,
  style: Partial<DefaultAnnotationStyle> = {},
): Partial<DefaultAnnotationStyle> => ({
  ..._DefaultAnnotationStyle,
  backgroundColor: 'transparent',
  borderColor: color,
  tagBorderColor: color,
  ...style,
});
