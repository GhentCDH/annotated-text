import { tokenize, Tokenizer } from "./tokenize";
import { type Snapper, SnapperAction, SnapperResult } from "../snapper";
import { TextAnnotation } from "../../../../model";

/**
 * WordSnapper ensures text annotations align to word boundaries.
 *
 * When users create annotations (highlights, comments, etc.) in text,
 * they might select partial words or whitespace. WordSnapper "snaps"
 * these selections to the nearest complete word boundaries for consistency.
 *
 * @example
 * ```typescript
 * const snapper = new WordSnapper();
 * snapper.setText("Hello world, how are you?");
 *
 * // User selects "llo wor" (partial words)
 * const result = snapper.fixOffset('drag', { start: 2, end: 9 });
 * // result: { start: 0, end: 11, modified: true, valid: true }
 * // Snaps to "Hello world"
 * ```
 */
export class WordSnapper implements Snapper {
  /**
   * Maps character indices to the start position of their containing token.
   * All characters within a token map to the token's start position.
   *
   * @example For "Hello world": { 0→0, 1→0, 2→0, 3→0, 4→0, 5→0, 6→6, 7→6... }
   */
  protected mapStartCharIndexToToken: { [index: number]: number } = {};

  /**
   * Maps character indices to the end position of their containing token.
   * All characters within a token map to the token's end position.
   *
   * @example For "Hello world": { 0→5, 1→5, 2→5, 3→5, 4→5, 5→5, 6→11, 7→11... }
   */
  protected mapStopCharIndexToToken: { [index: number]: number } = {};

  protected textLength = 0;

  protected tokenizerFn: Tokenizer = tokenize;
  private text = "";

  constructor(tokenizer?: Tokenizer) {
    this.tokenizerFn = tokenizer ?? tokenize;
  }

  setTokenizer(tokenizerFn: Tokenizer) {
    this.tokenizerFn = tokenizerFn;
    this.setText(this.text);
  }

  /**
   * Initializes the snapper with text content and builds token boundary maps.
   * Must be called before using fixOffset().
   *
   * @param text - The text content to tokenize and build boundary maps from
   *
   * @remarks
   * This method:
   * 1. Tokenizes the input text into words
   * 2. Records each token's start and end positions
   * 3. Fills gaps between tokens by propagating the nearest token boundaries
   *
   * The gap-filling ensures every character index maps to valid token boundaries,
   * even for whitespace or punctuation between words.
   */
  setText(text: string) {
    this.text = text;
    this.textLength = text.length;

    // Build initial maps with exact token boundaries
    this.tokenizerFn(text).forEach((token: any) => {
      const start = token.pos;
      const end = token.pos + token.value.length;

      this.mapStartCharIndexToToken[start] = start;
      this.mapStopCharIndexToToken[end] = end;
    });

    // Fill in all character positions with nearest token boundaries
    for (let i = 0; i < text.length; i++) {
      if (!this.mapStartCharIndexToToken[i]) {
        // Propagate the previous token's start position
        this.mapStartCharIndexToToken[i] =
          i > 0 ? this.mapStartCharIndexToToken[i - 1] : 0;
      }
      if (!this.mapStopCharIndexToToken[i]) {
        // Propagate the previous token's end position
        this.mapStopCharIndexToToken[i] =
          i > 0 ? this.mapStopCharIndexToToken[i - 1] : 0;
      }
    }
  }

  /**
   * Snaps the start position to the nearest token boundary.
   * Falls back to end position's token if start position has no mapping.
   *
   * @param annotation - Annotation with start and end positions
   * @returns Result with adjusted start position
   */
  protected fixStart(
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
      valid: closestStart < newEnd,
    };
  }

  /**
   * Snaps the end position to the nearest token boundary.
   * Falls back to start position's token if end position has no mapping.
   *
   * @param annotation - Annotation with start and end positions
   * @returns Result with adjusted end position
   */
  protected fixEnd(
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

  /**
   * Adjusts annotation boundaries to align with complete word boundaries.
   *
   * @param action - The user action that triggered the snap (e.g., 'drag', 'click')
   * @param annotation - The annotation to adjust
   * @returns The adjusted annotation with word-aligned boundaries
   *
   * @remarks
   * The algorithm:
   * 1. Snaps start position to the beginning of its containing word
   * 2. Snaps end position to the end of its containing word
   * 3. If snapping produces an invalid range (start >= end), incrementally
   *    extends the end position until a valid range is found
   * 4. Returns the final boundaries with validity and modification flags
   *
   * This ensures annotations always encompass complete words, improving
   * consistency and readability of highlights and selections.
   */
  fixOffset(action: SnapperAction, annotation: TextAnnotation): SnapperResult {
    let modifiedStart = this.fixStart(annotation);

    let start = modifiedStart.start;
    if (!modifiedStart.valid && start > -1) {
      start = Math.min(start, modifiedStart.start, annotation.start);
      modifiedStart = this.fixStart({
        start: start - 1,
        end: modifiedStart.end,
      });
      modifiedStart.valid = true;
    }

    let modifiedEnd = this.fixEnd(annotation);

    // Keep extending end position until we have a valid range
    let end = annotation.end;
    while (!modifiedEnd.valid && end <= this.textLength) {
      end =
        Math.max(end, annotation.end, modifiedStart.end, modifiedEnd.end) + 1;
      modifiedEnd = this.fixEnd({
        start: modifiedStart.start,
        end: end,
      });
    }

    start = modifiedStart.start;
    end = modifiedEnd.valid ? modifiedEnd.end : this.textLength;

    return {
      start,
      end,
      modified: annotation.start !== start || annotation.end !== end,
      valid: true,
    };
  }
}
