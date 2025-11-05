import { TextAnnotation } from "../../../model";

export type SnapperResult = {
  start: number;
  end: number;
  modified: boolean;
  valid?: boolean;
};

export type SnapperAction = "move-start" | "move-end" | "drag";

export abstract class Snapper {
  abstract setText(text: string, offsetStart: number): void;

  abstract fixOffset(
    action: SnapperAction,
    annotation: TextAnnotation,
  ): SnapperResult;
}

export class DefaultSnapper extends Snapper {
  override setText(text: string, offsetStart: number) {}

  fixOffset(action: SnapperAction, annotation: TextAnnotation): SnapperResult {
    return {
      start: annotation.start,
      end: annotation.end,
      modified: false,
    };
  }
}
