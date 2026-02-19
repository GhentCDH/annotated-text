export const lineHeightIds = {
  underline_offset_2: 'underline-offset-2',
  underline_offset_30: 'underline-offset-30',
  highlight_offset_2: 'highlight-offset-2',
  highlight_offset_10: 'highlight-offset-10',
  highlight_offset_30: 'highlight-offset-30',
  highlight_offset_40: 'highlight-offset-40',
  underline_offset_40: 'underline-offset-40',
} as const;

export type LineHeightKeys = keyof typeof lineHeightIds;

export const renderProblemIds = {
  default: 'default',
  scaled_1_5: 'scaled-1-5',
  scaled_0_75: 'scaled-0-75',
  underline_default: 'underline-default',
  underline_scaled_1_5: 'underline-scaled-1-5',
  underline_scaled_0_75: 'underline-scaled-0-75',
};
export type RenderProblemKeys = keyof typeof renderProblemIds;

export const styleIds = {
  defaultUnderline: 'style-underline',
  defaultHighlight: 'style-highlight',
  withTags: 'style-withTags',
  oneActiveHighlight: 'style-oneActive-highlight',
  oneActiveUnderline: 'style-oneActive-underline',
};

export type StyleKeys = keyof typeof styleIds;
