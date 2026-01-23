import type { TextLine } from '../model';

export const findTextLine = (textElement: HTMLElement, line: TextLine) => {
  return textElement.querySelector(
    `[data-line-uid="${line.uuid}"]`,
  ) as HTMLDivElement;
};
