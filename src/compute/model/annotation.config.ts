export const DefaultConfig = {
  gutter: {
    width: 3,
    gap: 6,
  },
  text: {
    padding: 4,
    lineHeight: 20,
    borderRadius: 3,
    border: 3,
  },
} as const;

export type AnnotationConfig = typeof DefaultConfig;
