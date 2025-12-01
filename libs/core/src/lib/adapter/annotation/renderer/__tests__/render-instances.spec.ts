import { beforeEach, describe, expect, it, vi } from "vitest";
import { TextAdapterStyle } from "@ghentcdh/annotated-text";
import { RenderInstances } from "../render-instances";
import type {
  AnnotationRender,
  AnnotationRenderParams,
  AnnotationRenderStyle,
} from "../annotation-render";
import type { TextAnnotation } from "../../../../model";

// Mock the Debugger module
vi.mock("../../../utils/debugger", () => ({
  Debugger: {
    verbose: vi.fn(),
    warn: vi.fn(),
  },
}));

interface TestAnnotation {
  id: string;
  type: string;
  renderType?: string;
}

interface TestStyle extends AnnotationRenderStyle {
  opacity: number;
  thickness: number;
}

/**
 * Creates a mock AnnotationRender for testing
 */
function createMockRenderer(
  name: string,
  options: { isGutter?: boolean } = {},
): AnnotationRender<TestStyle> {
  return {
    name,
    isGutter: options.isGutter ?? false,
    updateStyle: vi.fn(),
    createDraws: vi.fn().mockReturnValue([{ type: "rect", x: 0, y: 0 }]),
  } as unknown as AnnotationRender<TestStyle>;
}

describe("RenderInstances", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should create instance with default parameters when none provided", () => {
      const renders = new RenderInstances<TestAnnotation>();

      expect(renders.params).toBeUndefined();
      expect(renders.defaultRenderer).toBeNull();
    });

    it("should store provided params", () => {
      const customParams = {
        renderFn: (ann: TestAnnotation) => ann.type,
        defaultRenderer: "highlight",
      };

      const renders = new RenderInstances<TestAnnotation>(customParams);

      expect(renders.params).toBe(customParams);
    });

    it("should merge partial params with defaults", () => {
      const renders = new RenderInstances<TestAnnotation>({
        defaultRenderer: "custom-default",
      });

      expect(renders.defaultRenderer).toBe("custom-default");
    });
  });

  describe("defaultRenderer", () => {
    it("should return null when no renderer is registered and no default set", () => {
      const renders = new RenderInstances<TestAnnotation>();

      expect(renders.defaultRenderer).toBeNull();
    });

    it("should return the explicitly set default renderer", () => {
      const renders = new RenderInstances<TestAnnotation>({
        defaultRenderer: "my-default",
      });

      expect(renders.defaultRenderer).toBe("my-default");
    });

    it("should return first registered renderer as default when none specified", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const renderer = createMockRenderer("first-renderer");

      renders.registerRender(renderer);

      expect(renders.defaultRenderer).toBe("first-renderer");
    });
  });

  describe("registerRender", () => {
    it("should register a renderer by its name", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const renderer = createMockRenderer("highlight");

      renders.registerRender(renderer);

      expect(renders.getRendererByName("highlight")).toBe(renderer);
    });

    it("should set first renderer as default when no default is provided", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const renderer1 = createMockRenderer("first");
      const renderer2 = createMockRenderer("second");

      renders.registerRender(renderer1);
      renders.registerRender(renderer2);

      expect(renders.defaultRenderer).toBe("first");
    });

    it("should not override explicit default renderer", () => {
      const renders = new RenderInstances<TestAnnotation>({
        defaultRenderer: "explicit-default",
      });
      const renderer = createMockRenderer("new-renderer");

      renders.registerRender(renderer);

      expect(renders.defaultRenderer).toBe("explicit-default");
    });

    it("should allow overwriting existing renderers", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const renderer1 = createMockRenderer("same-name");
      const renderer2 = createMockRenderer("same-name");

      renders.registerRender(renderer1);
      renders.registerRender(renderer2);

      expect(renders.getRendererByName("same-name")).toBe(renderer2);
    });

    it("should support registering multiple renderers", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const highlight = createMockRenderer("highlight");
      const underline = createMockRenderer("underline");
      const strikethrough = createMockRenderer("strikethrough");

      renders.registerRender(highlight);
      renders.registerRender(underline);
      renders.registerRender(strikethrough);

      expect(renders.getRendererByName("highlight")).toBe(highlight);
      expect(renders.getRendererByName("underline")).toBe(underline);
      expect(renders.getRendererByName("strikethrough")).toBe(strikethrough);
    });
  });

  describe("updateRenderStyle", () => {
    it("should call updateStyle on the named renderer", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const renderer = createMockRenderer("highlight");

      renders.registerRender(renderer);
      renders.updateRenderStyle("highlight", { opacity: 0.5 } as any);

      expect(renderer.updateStyle).toHaveBeenCalledWith({ opacity: 0.5 });
    });

    it("should silently ignore updates to non-existent renderers", () => {
      const renders = new RenderInstances<TestAnnotation>();

      // Should not throw
      expect(() => {
        renders.updateRenderStyle("non-existent", { opacity: 0.5 } as any);
      }).not.toThrow();
    });

    it("should support partial style updates", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const renderer = createMockRenderer("highlight");

      renders.registerRender(renderer);
      renders.updateRenderStyle<TestStyle>("highlight", { thickness: 2 });

      expect(renderer.updateStyle).toHaveBeenCalledWith({ thickness: 2 });
    });
  });

  describe("getGutterRenders", () => {
    it("should return empty array when no renderers registered", () => {
      const renders = new RenderInstances<TestAnnotation>();

      expect(renders.getGutterRenders()).toEqual([]);
    });

    it("should return only gutter renderers", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const gutterRenderer1 = createMockRenderer("margin-note", {
        isGutter: true,
      });
      const gutterRenderer2 = createMockRenderer("line-number", {
        isGutter: true,
      });
      const textRenderer = createMockRenderer("highlight", { isGutter: false });

      renders.registerRender(gutterRenderer1);
      renders.registerRender(gutterRenderer2);
      renders.registerRender(textRenderer);

      const gutterRenders = renders.getGutterRenders();

      expect(gutterRenders).toHaveLength(2);
      expect(gutterRenders).toContain(gutterRenderer1);
      expect(gutterRenders).toContain(gutterRenderer2);
      expect(gutterRenders).not.toContain(textRenderer);
    });

    it("should return empty array when only text renderers exist", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const textRenderer1 = createMockRenderer("highlight", {
        isGutter: false,
      });
      const textRenderer2 = createMockRenderer("underline", {
        isGutter: false,
      });

      renders.registerRender(textRenderer1);
      renders.registerRender(textRenderer2);

      expect(renders.getGutterRenders()).toEqual([]);
    });
  });

  describe("getTextRenders", () => {
    it("should return empty array when no renderers registered", () => {
      const renders = new RenderInstances<TestAnnotation>();

      expect(renders.getTextRenders()).toEqual([]);
    });

    it("should return only non-gutter renderers", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const textRenderer1 = createMockRenderer("highlight", {
        isGutter: false,
      });
      const textRenderer2 = createMockRenderer("underline", {
        isGutter: false,
      });
      const gutterRenderer = createMockRenderer("margin-note", {
        isGutter: true,
      });

      renders.registerRender(textRenderer1);
      renders.registerRender(textRenderer2);
      renders.registerRender(gutterRenderer);

      const textRenders = renders.getTextRenders();

      expect(textRenders).toHaveLength(2);
      expect(textRenders).toContain(textRenderer1);
      expect(textRenders).toContain(textRenderer2);
      expect(textRenders).not.toContain(gutterRenderer);
    });

    it("should return empty array when only gutter renderers exist", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const gutterRenderer = createMockRenderer("margin-note", {
        isGutter: true,
      });

      renders.registerRender(gutterRenderer);

      expect(renders.getTextRenders()).toEqual([]);
    });
  });

  describe("getRendererByName", () => {
    it("should return renderer when found", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const renderer = createMockRenderer("highlight");

      renders.registerRender(renderer);

      expect(renders.getRendererByName("highlight")).toBe(renderer);
    });

    it("should return undefined when not found", () => {
      const renders = new RenderInstances<TestAnnotation>();

      expect(renders.getRendererByName("non-existent")).toBeUndefined();
    });
  });

  describe("getRenderer", () => {
    describe("when renderFn returns a valid renderer name", () => {
      it("should return the matching renderer", () => {
        const renders = new RenderInstances<TestAnnotation>({
          renderFn: (ann) => ann.type,
        });
        const highlightRenderer = createMockRenderer("highlight");
        const underlineRenderer = createMockRenderer("underline");

        renders.registerRender(highlightRenderer);
        renders.registerRender(underlineRenderer);

        const result = renders.getRenderer({ id: "1", type: "underline" });

        expect(result).toBe(underlineRenderer);
      });
    });

    describe("when renderFn returns null/undefined", () => {
      it("should fall back to default renderer", () => {
        const renders = new RenderInstances<TestAnnotation>({
          renderFn: () => null,
        });
        const defaultRenderer = createMockRenderer("default");

        renders.registerRender(defaultRenderer);

        const result = renders.getRenderer({ id: "1", type: "any" });

        expect(result).toBe(defaultRenderer);
      });

      it("should log verbose message about fallback", () => {
        const renders = new RenderInstances<TestAnnotation>({
          renderFn: () => null,
        });
        const defaultRenderer = createMockRenderer("default");

        renders.registerRender(defaultRenderer);

        const annotation = { id: "1", type: "test" };
        renders.getRenderer(annotation);
      });
    });

    describe("when renderFn returns a non-existent renderer name", () => {
      it("should fall back to default renderer", () => {
        const renders = new RenderInstances<TestAnnotation>({
          renderFn: (ann) => ann.type,
          defaultRenderer: "default",
        });
        const defaultRenderer = createMockRenderer("default");

        renders.registerRender(defaultRenderer);

        const result = renders.getRenderer({ id: "1", type: "non-existent" });

        expect(result).toBe(defaultRenderer);
      });

      it("should log warning about missing renderer", () => {
        const renders = new RenderInstances<TestAnnotation>({
          renderFn: (ann) => ann.type,
          defaultRenderer: "default",
        });
        const defaultRenderer = createMockRenderer("default");

        renders.registerRender(defaultRenderer);
        renders.getRenderer({ id: "1", type: "missing" });
      });
    });

    describe("when default renderer is not found", () => {
      it("should throw an error", () => {
        const renders = new RenderInstances<TestAnnotation>({
          renderFn: () => null,
          defaultRenderer: "non-existent-default",
        });

        expect(() => {
          renders.getRenderer({ id: "1", type: "test" });
        }).toThrow("Default renderer not found: non-existent-default");
      });

      it("should throw when renderFn returns unknown name and default is also missing", () => {
        const renders = new RenderInstances<TestAnnotation>({
          renderFn: () => "unknown",
          defaultRenderer: "also-missing",
        });

        expect(() => {
          renders.getRenderer({ id: "1", type: "test" });
        }).toThrow("Default renderer not found: also-missing");
      });
    });

    describe("when no renderFn is provided", () => {
      it("should use default renderer", () => {
        const renders = new RenderInstances<TestAnnotation>();
        const defaultRenderer = createMockRenderer("default");

        renders.registerRender(defaultRenderer);

        const result = renders.getRenderer({ id: "1", type: "test" });

        expect(result).toBe(defaultRenderer);
      });
    });
  });

  describe("highlightInstance", () => {
    it("should return the highlight renderer when registered", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const highlightRenderer = createMockRenderer("highlight");

      renders.registerRender(highlightRenderer);

      expect(renders.highlightInstance).toBe(highlightRenderer);
    });

    it("should throw when highlight renderer is not registered", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const otherRenderer = createMockRenderer("other");

      renders.registerRender(otherRenderer);

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        renders.highlightInstance;
      }).toThrow("Renderer not found: highlight");
    });

    it("should throw when no renderers are registered", () => {
      const renders = new RenderInstances<TestAnnotation>();

      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        renders.highlightInstance;
      }).toThrow("Renderer not found: highlight");
    });
  });

  describe("createDraws", () => {
    it("should call createDraws on the correct renderer", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const renderer = createMockRenderer("highlight");

      renders.registerRender(renderer);

      const textStyle = {} as TextAdapterStyle;
      const params = {} as AnnotationRenderParams;
      const parentDimensions = { x: 10, y: 20 };
      const annotation = {
        _render: { render: "highlight" },
      } as unknown as TextAnnotation;

      renders.createDraws(params, textStyle, parentDimensions, annotation);

      expect(renderer.createDraws).toHaveBeenCalledWith(
        params,
        textStyle,
        parentDimensions,
        annotation,
      );
    });

    it("should return the result from the renderer", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const expectedDraws = [{ type: "custom", data: "test" }];
      const renderer = createMockRenderer("highlight");
      (renderer.createDraws as ReturnType<typeof vi.fn>).mockReturnValue(
        expectedDraws,
      );

      renders.registerRender(renderer);

      const result = renders.createDraws(
        {} as AnnotationRenderParams,
        {} as any,
        { x: 0, y: 0 },
        { _render: { render: "highlight" } } as unknown as TextAnnotation,
      );

      expect(result).toBe(expectedDraws);
    });

    it("should throw when renderer is not found", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const renderer = createMockRenderer("other");

      renders.registerRender(renderer);

      const annotation = {
        _render: { render: "non-existent" },
      } as unknown as TextAnnotation;

      expect(() => {
        renders.createDraws(
          {} as AnnotationRenderParams,
          {} as any,
          { x: 0, y: 0 },
          annotation,
        );
      }).toThrow("Renderer not found: non-existent");
    });

    it("should work with different renderer types", () => {
      const renders = new RenderInstances<TestAnnotation>();
      const highlightRenderer = createMockRenderer("highlight");
      const underlineRenderer = createMockRenderer("underline");

      renders.registerRender(highlightRenderer);
      renders.registerRender(underlineRenderer);

      const highlightAnnotation = {
        _render: { render: "highlight" },
      } as unknown as TextAnnotation;
      const underlineAnnotation = {
        _render: { render: "underline" },
      } as unknown as TextAnnotation;

      renders.createDraws(
        {} as AnnotationRenderParams,
        {} as any,
        { x: 0, y: 0 },
        highlightAnnotation,
      );
      renders.createDraws(
        {} as AnnotationRenderParams,
        {} as any,
        { x: 0, y: 0 },
        underlineAnnotation,
      );

      expect(highlightRenderer.createDraws).toHaveBeenCalled();
      expect(underlineRenderer.createDraws).toHaveBeenCalled();
    });
  });

  describe("renderMap access", () => {
    it("should allow subclasses to access renderMap", () => {
      class ExtendedRenderInstances extends RenderInstances<TestAnnotation> {
        getRegisteredRendererNames(): string[] {
          return Array.from(this.renderMap.keys());
        }

        getRendererCount(): number {
          return this.renderMap.size;
        }
      }

      const renders = new ExtendedRenderInstances();
      renders.registerRender(createMockRenderer("renderer1"));
      renders.registerRender(createMockRenderer("renderer2"));
      renders.registerRender(createMockRenderer("renderer3"));

      expect(renders.getRegisteredRendererNames()).toEqual([
        "renderer1",
        "renderer2",
        "renderer3",
      ]);
      expect(renders.getRendererCount()).toBe(3);
    });
  });

  describe("complex scenarios", () => {
    it("should handle mixed gutter and text renderers correctly", () => {
      const renders = new RenderInstances<TestAnnotation>({
        renderFn: (ann) => ann.renderType ?? ann.type,
      });

      const textRenderers = [
        createMockRenderer("highlight", { isGutter: false }),
        createMockRenderer("underline", { isGutter: false }),
      ];

      const gutterRenderers = [
        createMockRenderer("margin-note", { isGutter: true }),
        createMockRenderer("line-marker", { isGutter: true }),
      ];

      [...textRenderers, ...gutterRenderers].forEach((r) =>
        renders.registerRender(r),
      );

      expect(renders.getTextRenders()).toHaveLength(2);
      expect(renders.getGutterRenders()).toHaveLength(2);
      expect(renders.defaultRenderer).toBe("highlight"); // First registered
    });

    it("should support dynamic render selection based on annotation properties", () => {
      const renders = new RenderInstances<TestAnnotation>({
        renderFn: (ann) => {
          if (ann.type === "important") return "highlight";
          if (ann.type === "note") return "margin-note";
          return null;
        },
        defaultRenderer: "underline",
      });

      const highlight = createMockRenderer("highlight");
      const marginNote = createMockRenderer("margin-note", { isGutter: true });
      const underline = createMockRenderer("underline");

      renders.registerRender(highlight);
      renders.registerRender(marginNote);
      renders.registerRender(underline);

      expect(renders.getRenderer({ id: "1", type: "important" })).toBe(
        highlight,
      );
      expect(renders.getRenderer({ id: "2", type: "note" })).toBe(marginNote);
      expect(renders.getRenderer({ id: "3", type: "other" })).toBe(underline);
    });
  });
});
