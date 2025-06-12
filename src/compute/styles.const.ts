const prefix = "ghent-cdh-annotation";

export const styles = {
  text: `annotated-text ${prefix}-text`,
  svg: `${prefix}-svg`,
  wrapper: `${prefix}-wrapper`,
  line: {
    wrapper: "",
    text: {
      wrapper: "content",
    },
    gutter: {
      wrapper: "gutter text",
    },
  },
};

export type Style = typeof styles;
