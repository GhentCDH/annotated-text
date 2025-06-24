import { v4 as uuidv4 } from "uuid";
import { ErrorCode, Errors } from "./errors";
import { AnnotationEvent, AnnotationEventData } from "../events";
import { Annotation } from "../../types/Annotation";
import { Debugger } from "../../utils/debugger";
import { createAnnotationColor } from "../../utils/createAnnotationColor";

export type SnapperAction = "move-start" | "move-end";
export type SnapperFn = (
  action: SnapperAction,
  annotation: Annotation,
) => { start: number; end: number };

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
    hover: (annotation: Annotation) => true,
    /**
     * Get the color of the annotation, by default the annotation.color.
     * If the annotation does not have a color, it will create color
     * @param annotation
     */
    color: (annotation: Annotation) => {
      return annotation?.color || createAnnotationColor("#4B7BF5");
    },
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
    /**
     * Use a word snapper function to adjust the start and end indices of an annotation.
     * @param action
     * @param annotation
     */
    useSnapper: (action: SnapperAction, annotation: Annotation) => {
      return { start: annotation.start, end: annotation.end };
    },
  },
  onEvent: <T extends AnnotationEventData>(event: AnnotationEvent<T>) => {
    Debugger.debug("default event listener", event);
  },
  onError: (error: ErrorCode, message: string, ...params: any[]) => {
    Debugger.warn(`[${Errors[error]}] - `, message, ...params);
  },
} as const;

export type AnnotationConfig = typeof DefaultConfig;
