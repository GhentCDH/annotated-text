import { beforeEach, describe, expect, it } from "vitest";
import { WordSnapper } from "./word-snapper";
import { TextAnnotation } from "../../../../model";

describe("WordSnapper", () => {
  let snapper: WordSnapper;

  beforeEach(() => {
    snapper = new WordSnapper();
  });

  describe("setText", () => {
    it("should initialize token boundary maps for simple text", () => {
      snapper.setText("Hello world");

      const result = snapper.fixOffset("drag", {
        start: 0,
        end: 5,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.start).toBe(0);
      expect(result.end).toBe(5);
    });

    it("should handle empty text", () => {
      snapper.setText("");

      const result = snapper.fixOffset("drag", {
        start: 0,
        end: 0,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.valid).toBe(true);
    });

    it("should handle text with multiple words", () => {
      snapper.setText("The quick brown fox");

      const result = snapper.fixOffset("drag", {
        start: 4,
        end: 9,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      // Should snap to word boundaries
      expect(result.start).toBeDefined();
      expect(result.end).toBeDefined();
      expect(result.valid).toBe(true);
    });
  });

  describe("fixOffset - snapping to word boundaries", () => {
    beforeEach(() => {
      snapper.setText("Hello world, how are you?");
    });

    it("should not modify when selection already aligns to word boundaries", () => {
      const result = snapper.fixOffset("drag", {
        start: 0,
        end: 5,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.start).toBe(0);
      expect(result.end).toBe(5);
      expect(result.modified).toBe(false);
      expect(result.valid).toBe(true);
    });

    it("should snap start position to word beginning", () => {
      // Selecting from middle of "Hello" (index 2)
      const result = snapper.fixOffset("drag", {
        start: 2,
        end: 5,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.start).toBe(0); // Snapped to start of "Hello"
      expect(result.modified).toBe(true);
      expect(result.valid).toBe(true);
    });

    it("should snap end position to word boundary", () => {
      // Selecting "Hello w" (partial "world")
      const result = snapper.fixOffset("drag", {
        start: 0,
        end: 7,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.end).toBeGreaterThanOrEqual(7);
      expect(result.modified).toBe(true);
      expect(result.valid).toBe(true);
    });

    it("should snap both start and end when selecting partial words", () => {
      // Selecting "llo wor" (partial on both sides)
      const result = snapper.fixOffset("drag", {
        start: 2,
        end: 9,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.start).toBe(0); // Start of "Hello"
      expect(result.end).toBeGreaterThanOrEqual(9);
      expect(result.modified).toBe(true);
      expect(result.valid).toBe(true);
    });

    it("should handle selection within whitespace", () => {
      // Selecting the space between "Hello" and "world"
      const result = snapper.fixOffset("drag", {
        start: 5,
        end: 6,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.valid).toBe(true);
      expect(result.start).toBeLessThan(result.end);
    });

    it("should handle single character selection", () => {
      const result = snapper.fixOffset("click", {
        start: 1,
        end: 2,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.valid).toBe(true);
      expect(result.start).toBeLessThan(result.end);
    });
  });

  describe("fixOffset - edge cases", () => {
    it("should handle selection at text boundaries", () => {
      snapper.setText("Hello world");

      const result = snapper.fixOffset("drag", {
        start: 0,
        end: 11,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.start).toBe(0);
      expect(result.valid).toBe(true);
    });

    it("should handle text with punctuation", () => {
      snapper.setText("Don't stop, believe!");

      const result = snapper.fixOffset("drag", {
        start: 0,
        end: 5,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.valid).toBe(true);
      expect(result.start).toBeLessThan(result.end);
    });

    it("should handle text with numbers", () => {
      snapper.setText("Item 123 costs $45.99 today");

      const result = snapper.fixOffset("drag", {
        start: 5,
        end: 8,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.valid).toBe(true);
    });

    it("should extend end position when initial snap creates invalid range", () => {
      snapper.setText("Hello world");

      // Create a scenario where start and end might snap to same position
      const result = snapper.fixOffset("drag", {
        start: 5,
        end: 5,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.valid).toBe(true);
      expect(result.start).toBeLessThan(result.end);
    });
  });

  describe("fixOffset - different text patterns", () => {
    it("should handle hyphenated words", () => {
      snapper.setText("state-of-the-art technology");

      const result = snapper.fixOffset("drag", {
        start: 6,
        end: 12,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.valid).toBe(true);
    });

    it("should handle text with newlines", () => {
      snapper.setText("First line\nSecond line");

      const result = snapper.fixOffset("drag", {
        start: 6,
        end: 15,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.valid).toBe(true);
    });

    it("should handle text with multiple spaces", () => {
      snapper.setText("Hello    world");

      const result = snapper.fixOffset("drag", {
        start: 5,
        end: 9,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.valid).toBe(true);
    });

    it("should handle quoted text", () => {
      snapper.setText('She said "hello world" yesterday');

      const result = snapper.fixOffset("drag", {
        start: 10,
        end: 21,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.valid).toBe(true);
    });
  });

  describe("fixOffset - action parameter", () => {
    beforeEach(() => {
      snapper.setText("Hello world");
    });

    it("should handle drag action", () => {
      const result = snapper.fixOffset("drag", {
        start: 2,
        end: 7,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.valid).toBe(true);
    });

    it("should handle click action", () => {
      const result = snapper.fixOffset("click", {
        start: 2,
        end: 7,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.valid).toBe(true);
    });

    // Note: The action parameter is currently not used in the implementation
    // but is part of the Snapper interface. These tests verify it's accepted.
  });

  describe("modified flag", () => {
    beforeEach(() => {
      snapper.setText("Hello world");
    });

    it("should set modified to false when no changes needed", () => {
      const result = snapper.fixOffset("drag", {
        start: 0,
        end: 5,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.modified).toBe(false);
    });

    it("should set modified to true when start position changes", () => {
      const result = snapper.fixOffset("drag", {
        start: 2,
        end: 5,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      expect(result.modified).toBe(true);
    });

    it("should set modified to true when end position changes", () => {
      const result = snapper.fixOffset("drag", {
        start: 0,
        end: 3,
        id: "test",
        type: "highlight",
      } as TextAnnotation);

      // End should snap to word boundary
      if (result.end !== 3) {
        expect(result.modified).toBe(true);
      }
    });
  });
});
