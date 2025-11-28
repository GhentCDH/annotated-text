import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AnnotationStyle,
  AnnotationStyleParams,
  DefaultAnnotationStyle,
} from "../annotation.style";
import { StyleInstances } from "../style-instances";
import { createAnnotationColor } from "../../../../utils/createAnnotationColor";

// Mock the Debugger module
vi.mock("@ghentcdh/annotated-text", () => ({
  Debugger: {
    verbose: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock createAnnotationColor for testing
vi.mock("../../../utils/createAnnotationColor", () => ({
  createAnnotationColor: (color: string) => ({ hex: color, rgb: [0, 0, 0] }),
}));

interface TestAnnotation {
  id: string;
  type: string;
  priority?: "low" | "medium" | "high";
}

describe("StyleInstances", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create instance with default parameters when none provided", () => {
      const styles = new StyleInstances<TestAnnotation>();

      expect(styles.params).toBeUndefined();
    });

    it("should store provided params", () => {
      const customParams = {
        styleFn: (ann: TestAnnotation) => ann.type,
      } as AnnotationStyleParams<TestAnnotation>;

      const styles = new StyleInstances<TestAnnotation>(customParams);

      expect(styles.params).toBe(customParams);
    });

    it("should merge partial params with defaults", () => {
      const customStyle: AnnotationStyle = {
        color: createAnnotationColor("#123456"),
      };

      const styles = new StyleInstances<TestAnnotation>({
        defaultStyle: customStyle,
      });

      // Verify the custom default style is used
      const result = styles.getStyle({ id: "1", type: "test" });
      expect(result).toEqual(customStyle);
    });
  });

  describe("registerStyle", () => {
    it("should register a named style", () => {
      const styles = new StyleInstances<TestAnnotation>({
        styleFn: (ann) => ann.type,
      });

      const customStyle: AnnotationStyle = {
        color: { hex: "#ff0000", rgb: [0, 0, 0] } as any,
      };

      styles.registerStyle("error", customStyle);

      const result = styles.getStyle({ id: "1", type: "error" });
      expect(result).toBe(customStyle);
    });

    it("should allow overwriting existing named styles", () => {
      const styles = new StyleInstances<TestAnnotation>({
        styleFn: (ann) => ann.type,
      });

      const firstStyle: AnnotationStyle = {
        color: { hex: "#ff0000", rgb: [0, 0, 0] } as any,
      };

      const secondStyle: AnnotationStyle = {
        color: { hex: "#00ff00", rgb: [0, 0, 0] } as any,
      };

      styles.registerStyle("highlight", firstStyle);
      styles.registerStyle("highlight", secondStyle);

      const result = styles.getStyle({ id: "1", type: "highlight" });
      expect(result).toBe(secondStyle);
    });

    it("should support registering multiple different styles", () => {
      const styles = new StyleInstances<TestAnnotation>({
        styleFn: (ann) => ann.type,
      });

      const errorStyle: AnnotationStyle = {
        color: { hex: "#f44336", rgb: [0, 0, 0] } as any,
      };

      const warningStyle: AnnotationStyle = {
        color: { hex: "#ff9800", rgb: [0, 0, 0] } as any,
      };

      const infoStyle: AnnotationStyle = {
        color: { hex: "#2196f3", rgb: [0, 0, 0] } as any,
      };

      styles.registerStyle("error", errorStyle);
      styles.registerStyle("warning", warningStyle);
      styles.registerStyle("info", infoStyle);

      expect(styles.getStyle({ id: "1", type: "error" })).toBe(errorStyle);
      expect(styles.getStyle({ id: "2", type: "warning" })).toBe(warningStyle);
      expect(styles.getStyle({ id: "3", type: "info" })).toBe(infoStyle);
    });
  });

  describe("getStyle", () => {
    describe("when styleFn returns null", () => {
      it("should return default style", () => {
        const styles = new StyleInstances<TestAnnotation>({
          styleFn: () => null,
        });

        const result = styles.getStyle({ id: "1", type: "test" });

        expect(result).toBe(DefaultAnnotationStyle);
      });

      it("should return custom default style when provided", () => {
        const customDefault: AnnotationStyle = {
          color: createAnnotationColor("#ff0000"),
        };

        const styles = new StyleInstances<TestAnnotation>({
          styleFn: () => null,
          defaultStyle: customDefault,
        });

        const result = styles.getStyle({ id: "1", type: "test" });

        expect(result).toEqual(customDefault);
      });
    });

    describe("when styleFn returns a string", () => {
      it("should return registered style when name exists", () => {
        const styles = new StyleInstances<TestAnnotation>({
          styleFn: (ann) => ann.type,
        });

        const registeredStyle: AnnotationStyle = {
          color: { hex: "#registered", rgb: [0, 0, 0] } as any,
        };

        styles.registerStyle("highlight", registeredStyle);

        const result = styles.getStyle({ id: "1", type: "highlight" });

        expect(result).toBe(registeredStyle);
      });

      it("should return default style when name is not registered", () => {
        const styles = new StyleInstances<TestAnnotation>({
          styleFn: (ann) => ann.type,
        });

        const result = styles.getStyle({ id: "1", type: "unknown" });

        expect(result).toBe(DefaultAnnotationStyle);
      });
    });

    describe("when styleFn returns an AnnotationStyle object", () => {
      it("should return the style object directly", () => {
        const directStyle: AnnotationStyle = {
          color: { hex: "#direct", rgb: [0, 0, 0] } as any,
        };

        const styles = new StyleInstances<TestAnnotation>({
          styleFn: () => directStyle,
        });

        const result = styles.getStyle({ id: "1", type: "test" });

        expect(result).toBe(directStyle);
      });

      it("should support dynamic style generation based on annotation", () => {
        const highPriorityStyle: AnnotationStyle = {
          color: { hex: "#high", rgb: [0, 0, 0] } as any,
        };

        const lowPriorityStyle: AnnotationStyle = {
          color: { hex: "#low", rgb: [0, 0, 0] } as any,
        };

        const styles = new StyleInstances<TestAnnotation>({
          styleFn: (ann) => {
            if (ann.priority === "high") return highPriorityStyle;
            if (ann.priority === "low") return lowPriorityStyle;
            return null;
          },
        });

        expect(
          styles.getStyle({ id: "1", type: "test", priority: "high" }),
        ).toBe(highPriorityStyle);

        expect(
          styles.getStyle({ id: "2", type: "test", priority: "low" }),
        ).toBe(lowPriorityStyle);

        expect(
          styles.getStyle({ id: "3", type: "test", priority: "medium" }),
        ).toBe(DefaultAnnotationStyle);
      });
    });

    describe("complex scenarios", () => {
      it("should support mixed style resolution strategies", () => {
        const directStyle: AnnotationStyle = {
          color: { hex: "#direct", rgb: [0, 0, 0] } as any,
        };

        const namedStyle: AnnotationStyle = {
          color: { hex: "#named", rgb: [0, 0, 0] } as any,
        };

        const styles = new StyleInstances<TestAnnotation>({
          styleFn: (ann) => {
            if (ann.type === "direct") return directStyle;
            if (ann.type === "named") return "registered-name";
            return null;
          },
        });

        styles.registerStyle("registered-name", namedStyle);

        // Direct style object
        expect(styles.getStyle({ id: "1", type: "direct" })).toBe(directStyle);

        // Named style lookup
        expect(styles.getStyle({ id: "2", type: "named" })).toBe(namedStyle);

        // Default fallback
        expect(styles.getStyle({ id: "3", type: "other" })).toBe(
          DefaultAnnotationStyle,
        );
      });

      it("should handle empty string style names", () => {
        const styles = new StyleInstances<TestAnnotation>({
          styleFn: (annotation: TestAnnotation) => "",
        });

        const result = styles.getStyle({ id: "1", type: "test" });

        expect(result).toBe(DefaultAnnotationStyle);
      });

      it("should work with complex annotation types", () => {
        interface ComplexAnnotation {
          id: string;
          metadata: {
            category: string;
            tags: string[];
          };
          author: {
            name: string;
            role: string;
          };
        }

        const adminStyle: AnnotationStyle = {
          color: { hex: "#admin", rgb: [0, 0, 0] } as any,
        };

        const styles = new StyleInstances<ComplexAnnotation>({
          styleFn: (ann) => {
            if (ann.author.role === "admin") return adminStyle;
            return ann.metadata.category;
          },
        });

        const categoryStyle: AnnotationStyle = {
          color: { hex: "#category", rgb: [0, 0, 0] } as any,
        };

        styles.registerStyle("important", categoryStyle);

        const adminAnnotation: ComplexAnnotation = {
          id: "1",
          metadata: { category: "regular", tags: [] },
          author: { name: "Admin", role: "admin" },
        };

        const regularAnnotation: ComplexAnnotation = {
          id: "2",
          metadata: { category: "important", tags: [] },
          author: { name: "User", role: "user" },
        };

        expect(styles.getStyle(adminAnnotation)).toBe(adminStyle);
        expect(styles.getStyle(regularAnnotation)).toBe(categoryStyle);
      });
    });
  });

  describe("styleMap access", () => {
    it("should allow subclasses to access styleMap", () => {
      class ExtendedStyleInstances extends StyleInstances<TestAnnotation> {
        getRegisteredStyleNames(): string[] {
          return Array.from(this.styleMap.keys());
        }

        hasStyle(name: string): boolean {
          return this.styleMap.has(name);
        }
      }

      const styles = new ExtendedStyleInstances({
        styleFn: (ann) => ann.type,
      });

      styles.registerStyle("style1", DefaultAnnotationStyle);
      styles.registerStyle("style2", DefaultAnnotationStyle);

      expect(styles.getRegisteredStyleNames()).toEqual(["style1", "style2"]);
      expect(styles.hasStyle("style1")).toBe(true);
      expect(styles.hasStyle("nonexistent")).toBe(false);
    });
  });
});
