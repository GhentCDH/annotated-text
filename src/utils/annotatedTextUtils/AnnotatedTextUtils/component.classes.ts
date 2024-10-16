import memoize from "memoizee";
import type { ActionType } from "../../../types/AnnotatedText";

const componentClasses_ = (
  theme: string,
  render: string,
  showLabels: boolean,
  action?: ActionType
) => {
  const classes = [
    "annotated-text",
    `theme-${theme}`,
    `annotated-text--render-${render}`,
    action ? `action--active action--${action}` : null,
    showLabels ? "annotated-text--show-labels" : null,
  ];
  return classes.filter((item) => item);
};

export const componentClasses = memoize(componentClasses_);
