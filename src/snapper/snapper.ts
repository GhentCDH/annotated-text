import { TextAnnotation } from "../compute/annotation.model";

export type SnapperAction = "move-start" | "move-end";
export type SnapperFn = (
  action: SnapperAction,
  annotation: TextAnnotation,
) => { start: number; end: number };

export const DefaultSnapper: SnapperFn = (
  action: SnapperAction,
  annotation: TextAnnotation,
) => {
  return { start: annotation.start, end: annotation.end };
};
