import { describe, expect, it } from 'vitest';
import { type DimensionsWithScale, getScale, getScaledDimensions, getUnscaledRect } from '../unscaled';

describe('unscaled', () => {
  describe('getScale', () => {
    it.each`
      width  | offsetWidth | expected | description
      ${200} | ${100}      | ${2}     | ${'scaled up 2x'}
      ${100} | ${100}      | ${1}     | ${'no scaling'}
      ${50}  | ${100}      | ${0.5}   | ${'scaled down 0.5x'}
      ${150} | ${100}      | ${1.5}   | ${'decimal scale 1.5x'}
      ${125} | ${100}      | ${1.25}  | ${'decimal scale 1.25x'}
      ${100} | ${0}        | ${1}     | ${'zero offsetWidth (division by zero)'}
      ${0}   | ${100}      | ${1}     | ${'zero width'}
    `(
      'should return $expected when $description',
      ({ width, offsetWidth, expected }) => {
        expect(getScale(width, offsetWidth)).toBe(expected);
      },
    );
  });

  describe('getUnscaledRect', () => {
    const createMockElement = (
      rect: Partial<DOMRect>,
      offsetWidth: number,
      offsetHeight: number,
    ): HTMLElement =>
      ({
        getBoundingClientRect: () => ({
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          top: 0,
          right: 100,
          bottom: 100,
          left: 0,
          toJSON: () => ({}),
          ...rect,
        }),
        offsetWidth,
        offsetHeight,
      }) as HTMLElement;

    it.each`
      rect                                         | offsetWidth | offsetHeight | expected                                                | description
      ${{ x: 10, y: 20, width: 100, height: 50 }}  | ${100}      | ${50}        | ${{ width: 100, height: 50, x: 10, y: 20, scale: 1 }}   | ${'scale is 1'}
      ${{ x: 10, y: 20, width: 200, height: 100 }} | ${100}      | ${50}        | ${{ width: 100, height: 50, x: 10, y: 20, scale: 2 }}   | ${'element is scaled up 2x'}
      ${{ x: 10, y: 20, width: 50, height: 25 }}   | ${100}      | ${50}        | ${{ width: 100, height: 50, x: 10, y: 20, scale: 0.5 }} | ${'element is scaled down 0.5x'}
      ${{ x: 0, y: 0, width: 100, height: 50 }}    | ${0}        | ${0}         | ${{ width: 0, height: 0, x: 0, y: 0, scale: 1 }}        | ${'zero offsetWidth (graceful handling)'}
    `(
      'should return unscaled dimensions when $description',
      ({ rect, offsetWidth, offsetHeight, expected }) => {
        const element = createMockElement(rect, offsetWidth, offsetHeight);
        expect(getUnscaledRect(element)).toEqual(expected);
      },
    );
  });

  describe('getScaledDimensions', () => {
    it.each`
      parentDimensions                                           | elementRect                                    | expected                                     | description
      ${{ x: 100, y: 100, width: 500, height: 300, scale: 1 }}   | ${{ x: 150, y: 120, width: 200, height: 100 }} | ${{ x: 50, y: 20, width: 200, height: 100 }} | ${'scale is 1'}
      ${{ x: 100, y: 100, width: 500, height: 300, scale: 2 }}   | ${{ x: 200, y: 140, width: 100, height: 50 }}  | ${{ x: 50, y: 20, width: 50, height: 25 }}   | ${'scaled up 2x'}
      ${{ x: 100, y: 100, width: 250, height: 150, scale: 0.5 }} | ${{ x: 150, y: 120, width: 50, height: 25 }}   | ${{ x: 100, y: 40, width: 100, height: 50 }} | ${'scaled down 0.5x'}
      ${{ x: 100, y: 100, width: 500, height: 300, scale: 1.5 }} | ${{ x: 100, y: 100, width: 150, height: 75 }}  | ${{ x: 0, y: 0, width: 100, height: 50 }}    | ${'element at same position as parent'}
      ${{ x: 200, y: 200, width: 500, height: 300, scale: 2 }}   | ${{ x: 100, y: 150, width: 100, height: 50 }}  | ${{ x: -50, y: -25, width: 50, height: 25 }} | ${'negative relative positions'}
    `(
      'should return correct dimensions when $description',
      ({ parentDimensions, elementRect, expected }) => {
        expect(
          getScaledDimensions(
            parentDimensions as DimensionsWithScale,
            elementRect as DOMRect,
          ),
        ).toEqual(expected);
      },
    );
  });
});
