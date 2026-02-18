export const _DefaultAnnotationStyle = {
  backgroundColor: '#ff3b3b',
  backgroundOpacity: 0.3,
  borderColor: '#ff3b3b',
  borderOpacity: 0.6,
  borderWidth: 2,
  borderRadius: 6,

  // Only for tags
  tagTextColor: '#000000',
  tagBackgroundColor: '#ffffff',
  tagBackgroundOpacity: 0.6,
  tagBorderColor: '#ff3b3b',
  tagBorderOpacity: 0.6,
  tagBorderWidth: 1,

  // only for gutter annotations for now
  gap: 6,
  width: 3,
};

export type DefaultAnnotationStyle = typeof _DefaultAnnotationStyle;

const _DefaultHoverStyle = {
  borderWidth: 2,
  backgroundColor: '#cccccc',
};
const _DefaultEditStyle = {
  backgroundColor: '#ff3b3b',
  borderWidth: 2,
};
const _DefaultActiveStyle = {
  backgroundOpacity: 0.5,
  borderWidth: 2,
};

export const AnnotationDefaultStyle: CustomAnnotationStyle = {
  default: _DefaultAnnotationStyle,
  hover: _DefaultHoverStyle,
  active: _DefaultActiveStyle,
  edit: _DefaultEditStyle,
};

export type CustomAnnotationStyle = {
  default?: Partial<DefaultAnnotationStyle>;
  edit?: Partial<DefaultAnnotationStyle>;
  active?: Partial<DefaultAnnotationStyle>;
  hover?: Partial<DefaultAnnotationStyle>;
};
