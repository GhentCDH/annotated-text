export const renderMarkdownIds = {
  underline: 'markdown-default-underline',
  highlight: 'markdown-default-highlight',
  highlight_plain: 'markdown-plain-highlight',
  limit: 'markdown-limit-ignore-lines',
  limit_no_ignore: 'markdown-limit-NO-ignore-lines',
} as const;

export type RenderMarkdownKeys = keyof typeof renderMarkdownIds;
