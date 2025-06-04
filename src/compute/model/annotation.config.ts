import { Debugger } from "@ghentcdh/vue-component-annotated-text";
import { AnnotationEvent } from "../events";

export const DefaultConfig = {
  actions: { edit: false },
  gutter: {
    width: 3,
    gap: 6,
  },
  text: {
    padding: 4,
    lineHeight: 20,
    borderRadius: 3,
    border: 3,
    handleRadius: 6,
  },
  hover: {
    color: {
      border: "rgba(100, 100, 100, 0.5)",
      fill: "rgba(1, 1, 1, 0.1)",
    },
  },
  visualEvent: {
    /**
     *  If return true, then on hover it becomes the active color
     */
    hover: (annotation) => true,
  },
  onEvent: (event: AnnotationEvent) => {
    Debugger.debug("default event listener", event);
  },
} as const;

export type AnnotationConfig = typeof DefaultConfig;
