import { describe, expect, it, vi } from 'vitest';
import { getLineHeight } from '../line-height';

describe('getLineHeight', () => {
  it.each`
    lineHeight | offset | expected
    ${'20px'}  | ${2}   | ${22}
    ${'30px'}  | ${0}   | ${30}
  `(
    'should return $expected for line-height $lineHeight and offset $offset',
    ({ lineHeight, offset, expected }) => {
      const parent = document.createElement('div');
      parent.style.lineHeight = lineHeight;
      document.body.appendChild(parent);

      expect(getLineHeight('text', offset, parent)).toBe(expected);
    },
  );

  it('should measure inside the given parent, so it inherits the zoomed font', () => {
    const parent = document.createElement('div');
    const append = vi.spyOn(parent, 'appendChild');

    getLineHeight('text', 2, parent);

    expect(append).toHaveBeenCalledOnce();
    expect(parent.children).toHaveLength(0);
  });
});
