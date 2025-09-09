export type TagConfig<ANNOTATION> = {
  /**
   * If true, tags are enabled and will be rendered, when hovering over an annotation.
   * @default false
   */
  enabledOnHover: boolean;
  /**
   * If true, tags are always enabled and will be rendered.
   * @default false
   */
  enabled: boolean;
  /**
   * Function to get the tag string from an annotation.
   * @param annotation
   */
  tagFn: (annotation: ANNOTATION) => string;
  padding: number;
  fontSize: number;
};

export const DefaultTagConfig: TagConfig<any> = {
  enabledOnHover: false,
  enabled: false,
  tagFn: (annotation: any) => "No tag",
  padding: 1,
  fontSize: 8,
};
