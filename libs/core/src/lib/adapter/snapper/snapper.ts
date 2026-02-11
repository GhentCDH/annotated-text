import { type TextAnnotation } from '../../model';

export type SnapperResult = {
  start: number;
  end: number;
  modified: boolean;
};

export type SnapperAction = 'move-start' | 'move-end' | 'drag';

export abstract class Snapper {
  abstract setText(text: string, offsetStart: number): void;

  abstract fixOffset(annotation: TextAnnotation): SnapperResult;
}

export class DefaultSnapper extends Snapper {
  protected text = '';
  protected offsetStart = 0;
  protected textLength = 0;

  override setText(text: string, offsetStart: number) {
    this.text = text ?? '';
    this.offsetStart = offsetStart;
    this.textLength = this.text.length + offsetStart;
  }

  fixOffset(annotation: TextAnnotation): SnapperResult {
    return {
      start: annotation.start,
      end: annotation.end,
      modified: false,
    };
  }
}
