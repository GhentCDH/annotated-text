import { tokenize } from "./tokenize";
import { type Snapper, SnapperAction, SnapperResult } from "../snapper";
import { TextAnnotation } from "../../../../model";

export class WordSnapper implements Snapper {
  private mapStartCharIndexToToken: { [index: number]: number } = {};
  private mapStopCharIndexToToken: { [index: number]: number } = {};

  setText(text: string) {
    //console.log(text);
    tokenize(text).forEach((token: any) => {
      const start = token.pos;
      const end = token.pos + token.value.length - 1;

      this.mapStartCharIndexToToken[start] = start;
      this.mapStopCharIndexToToken[end] = end;
    });

    for (let i = 0; i < text.length; i++) {
      if (!this.mapStartCharIndexToToken[i]) {
        // Find the closest previous start index
        this.mapStartCharIndexToToken[i] =
          i > 0 ? this.mapStartCharIndexToToken[i - 1] : 0;
      }
      if (!this.mapStopCharIndexToToken[i]) {
        // Find the closest previous end index
        this.mapStopCharIndexToToken[i] =
          i > 0 ? this.mapStopCharIndexToToken[i - 1] : 0;
      }
    }
  }

  fixOffset(action: SnapperAction, annotation: TextAnnotation): SnapperResult {
    const { start: newStart, end: newEnd } = annotation;
    const closestStart =
      this.mapStartCharIndexToToken[newStart] ??
      this.mapStartCharIndexToToken[newEnd];
    const closestEnd =
      this.mapStopCharIndexToToken[newEnd] ??
      this.mapStopCharIndexToToken[newStart];
    return {
      start: closestStart,
      end: closestEnd,
      modified: closestStart !== newStart || closestEnd !== newEnd,
    };
  }
}
