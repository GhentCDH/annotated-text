import { describe, expect, it } from 'vitest';
import {
  calculateOffset,
  insideRange,
  isInsideBoundingRect,
} from '../bounding-rect';

describe('insideRange', () => {
  it.each`
    a    | b     | value | expected
    ${0} | ${10} | ${5}  | ${true}
    ${0} | ${10} | ${0}  | ${true}
    ${0} | ${10} | ${10} | ${true}
    ${0} | ${10} | ${-1} | ${false}
    ${0} | ${10} | ${11} | ${false}
  `(
    'returns $expected for insideRange($a, $b, $value)',
    ({ a, b, value, expected }) => {
      expect(insideRange(a, b, value)).toBe(expected);
    },
  );
  it.each`
    a    | b     | value | expected
    ${0} | ${10} | ${5}  | ${true}
    ${0} | ${10} | ${0}  | ${true}
    ${0} | ${10} | ${10} | ${true}
    ${0} | ${10} | ${-1} | ${true}
    ${0} | ${10} | ${11} | ${true}
    ${0} | ${10} | ${-3} | ${false}
    ${0} | ${10} | ${14} | ${false}
  `(
    'returns $expected for insideRange($a, $b, $value, 2) with offset 2',
    ({ a, b, value, expected }) => {
      expect(insideRange(a, b, value, 2)).toBe(expected);
    },
  );
});

describe('isInsideBoundingRect', () => {
  it.each`
    x     | y     | left | right | top  | bottom | expected
    ${5}  | ${5}  | ${0} | ${10} | ${0} | ${10}  | ${true}
    ${15} | ${5}  | ${0} | ${10} | ${0} | ${10}  | ${false}
    ${5}  | ${15} | ${0} | ${10} | ${0} | ${10}  | ${false}
    ${-5} | ${5}  | ${0} | ${10} | ${0} | ${10}  | ${false}
  `(
    'returns $expected for isInsideBoundingRect($a, $b, $value)',
    ({ x, y, left, right, top, bottom, expected }) => {
      const rect = { left, right, top, bottom } as DOMRect;
      expect(isInsideBoundingRect(x, y, rect)).toBe(expected);
    },
  );
});
describe('calculateOffset', () => {
  it.each`
    lineHeight | height | expected
    ${20}      | ${10}  | ${5}
    ${10}      | ${10}  | ${0}
    ${15}      | ${10}  | ${2.5}
    ${10}      | ${20}  | ${-5}
    ${25}      | ${12}  | ${6.5}
  `(
    'returns $expected for lineHeight=$lineHeight and height=$height',
    ({ lineHeight, height, expected }) => {
      expect(calculateOffset(lineHeight, height)).toBe(expected);
    },
  );
});
