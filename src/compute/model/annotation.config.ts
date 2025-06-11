import {
  createAnnotationColor,
  Debugger,
} from "@ghentcdh/vue-component-annotated-text";
import { v4 as uuidv4 } from "uuid";
import { AnnotationEvent } from "../events";

export const DefaultConfig = {
  actions: { edit: false, create: false },
  gutter: {
    width: 3,
    gap: 6,
  },
  text: {
    padding: 3,
    lineHeight: 22,
    borderRadius: 3,
    border: 2,
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
    /**
     * Create a new annotation object with default values.
     */
    create: () => {
      return {
        id: uuidv4(),
        isGutter: false,
        color: createAnnotationColor("#f51720"),
      };
    },
  },
  onEvent: <T>(event: AnnotationEvent<T>) => {
    Debugger.debug("default event listener", event);
  },
} as const;

export type AnnotationConfig = typeof DefaultConfig;
