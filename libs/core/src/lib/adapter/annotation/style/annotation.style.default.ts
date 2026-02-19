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
  tagBackgroundOpacity: 0.1,
  tagBorderColor: '#ff3b3b',
  tagBorderOpacity: 0.6,
  tagBorderWidth: 1,

  // only for gutter annotations for now
  gutterGap: 6,
  gutterWidth: 3,
};

export type DefaultAnnotationStyle = typeof _DefaultAnnotationStyle;

// TODO decide which ones we want to allow to be overridden and which not,
//  for now we allow all except width and gap since they are more specific to the annotation type
export type DefaultOverrideStyle = Partial<
  Pick<
    DefaultAnnotationStyle,
    | 'backgroundColor'
    | 'backgroundOpacity'
    | 'borderColor'
    | 'borderOpacity'
    | 'borderWidth'
  >
>;

const _DefaultHoverStyle: DefaultOverrideStyle = {
  borderWidth: 2,
  backgroundColor: '#cccccc',
  borderColor: '#cccccc',
  borderOpacity: 0.9,
};
const _DefaultEditStyle: DefaultOverrideStyle = {
  backgroundColor: '#ff3b3b',
  borderColor: '#ff3b3b',
  borderOpacity: 0.9,
  borderWidth: 2,
};
const _DefaultActiveStyle: DefaultOverrideStyle = {
  backgroundOpacity: 0.8,
  borderOpacity: 0.9,
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
  edit?: DefaultOverrideStyle;
  active?: DefaultOverrideStyle;
  hover?: DefaultOverrideStyle;
};
