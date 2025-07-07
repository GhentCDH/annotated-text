import { describe, expect, it } from "vitest";
import { isIntersection } from "../path-to-your/intersect"; // Adjust the path accordingly

describe("isIntersection", () => {
  it.each`
    a                        | b                        | result
    ${{ start: 0, end: 10 }} | ${{ start: 2, end: 8 }}  | ${true}
    ${{ start: 0, end: 5 }}  | ${{ start: 4, end: 10 }} | ${true}
    ${{ start: 0, end: 3 }}  | ${{ start: 4, end: 6 }}  | ${false}
    ${{ start: 0, end: 5 }}  | ${{ start: 5, end: 10 }} | ${false}
    ${{ start: 1, end: 5 }}  | ${{ start: 1, end: 5 }}  | ${true}
    ${{ start: 7, end: 10 }} | ${{ start: 5, end: 8 }}  | ${true}
  `("returns $result for a=$a and b=$b", ({ a, b, result }) => {
    expect(isIntersection(a, b)).toBe(result);
  });
});
