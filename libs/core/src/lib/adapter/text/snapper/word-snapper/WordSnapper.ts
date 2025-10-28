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
      const end = token.pos + token.value.length;

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

  private fixStart(
    annotation: Pick<TextAnnotation, "end" | "start">,
  ): SnapperResult {
    const { start: newStart, end: newEnd } = annotation;

    const closestStart =
      this.mapStartCharIndexToToken[newStart] ??
      this.mapStartCharIndexToToken[newEnd];

    return {
      start: closestStart,
      modified: closestStart !== newStart,
      end: newEnd,
      valid: newStart < newEnd,
    };
  }

  private fixEnd(
    annotation: Pick<TextAnnotation, "end" | "start">,
  ): SnapperResult {
    const { start: newStart, end: newEnd } = annotation;

    const closestEnd =
      this.mapStopCharIndexToToken[newEnd] ??
      this.mapStopCharIndexToToken[newStart];

    return {
      start: newStart,
      modified: closestEnd !== newEnd,
      end: closestEnd,
      valid: newStart < closestEnd,
    };
  }

  private fixUntilValid(
    annotation: TextAnnotation,
  ): SnapperResult & { valid: boolean } {
    // Asume that start is always right in this case,
    const modified = this.fixEnd({
      start: annotation.start,
      end: annotation.end + 1,
    });

    return { ...modified, valid: modified.start < modified.end };
  }

  fixOffset(action: SnapperAction, annotation: TextAnnotation): SnapperResult {
    const modifiedStart = this.fixStart(annotation);
    let modifiedEnd = this.fixEnd(annotation);

    let end = annotation.end;
    while (!modifiedEnd.valid) {
      end =
        Math.max(end, annotation.end, modifiedStart.end, modifiedEnd.end) + 1;

      modifiedEnd = this.fixEnd({
        start: modifiedStart.start,
        end: end,
      });
    }

    return {
      start: modifiedStart.start,
      end: modifiedEnd.end,
      modified: modifiedStart.modified || modifiedEnd.modified,
      valid: true,
    };
  }
}
