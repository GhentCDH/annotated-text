import { TextAnnotation } from "../../../model";

export type SnapperResult = {
  start: number;
  end: number;
  modified: boolean;
};

export type SnapperAction = "move-start" | "move-end";

export abstract class Snapper {
  setText(text: string) {}

  abstract fixOffset(
    action: SnapperAction,
    annotation: TextAnnotation,
  ): SnapperResult;
}

export class DefaultSnapper extends Snapper {
  fixOffset(action: SnapperAction, annotation: TextAnnotation): SnapperResult {
    return { start: annotation.start, end: annotation.end, modified: false };
  }
}
