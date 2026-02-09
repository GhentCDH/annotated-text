import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RenderInstances } from '../render-instances';
import {
  AnnotationRender,
  type AnnotationRenderStyle,
  DefaultAnnotationRenderStyle,
} from '../annotation-render';
import type { TextAnnotation } from '../../../../model';
import { type AnnotationModule } from '../../../../di/annotation.module';
import {
  AnnotationAdapterToken,
  TextAdapterToken,
} from '../../../../di/tokens';
import { SvgModel } from '../../../../compute/model/svg.types'; // Mock the Debugger module

// Mock the Debugger module
vi.mock('../../../../utils/debugger', () => ({
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
class MockRenderer extends AnnotationRender<AnnotationRenderStyle> {
  weightOrder = 1;
  isGutter: boolean;
  renderTag: boolean;

  constructor(name: string, options: { isGutter?: boolean } = {}) {
    super(name, {}, DefaultAnnotationRenderStyle);
    this.isGutter = options.isGutter ?? false;
  }

  createDraws = vi.fn().mockReturnValue({
    draws: [{ type: 'rect', x: 0, y: 0 }],
    dimensions: { x: 0, y: 0, width: 100, height: 20 },
    color: { primary: '#000', border: '#000' },
  });
}

/**
 * Creates a minimal mock AnnotationModule for testing
 */
function createMockAnnotationModule(renderParams?: {
  defaultRenderer?: string;
  renderFn?: (ann: any) => string | null;
}) {
  // Create mock adapters
  const mockTextAdapter = {
    setModule: vi.fn(),
  };

  const mockAnnotationAdapter = {
    setModule: vi.fn(),
    renderParams: renderParams ?? {},
  };

  const mockSvgModel = {};

  // Create a partial mock of AnnotationModule
  const module = {
    inject: vi.fn((token: any) => {
      if (token === AnnotationAdapterToken) return mockAnnotationAdapter;
      if (token === TextAdapterToken) return mockTextAdapter;
      if (token === SvgModel) return mockSvgModel;
      throw new Error(`Service not found in mock: ${String(token)}`);
    }),
    register: vi.fn().mockReturnThis(),
    registerRender: vi.fn(),
    hasRender: vi.fn().mockReturnValue(false),
    injectRender: vi.fn(),
    getAllRenderInstances: vi.fn().mockReturnValue([]),
    destroy: vi.fn(),
  } as unknown as AnnotationModule;

  return module;
}

describe('RenderInstances', () => {
  let mockModule: AnnotationModule;

  beforeEach(() => {
    vi.clearAllMocks();
    mockModule = createMockAnnotationModule();
  });

  describe('constructor', () => {
    it('should register default renderers on creation', () => {
      new RenderInstances(mockModule);

      // Should register highlight, gutter, and underline renderers
      expect(mockModule.registerRender).toHaveBeenCalledTimes(3);
      expect(mockModule.registerRender).toHaveBeenCalledWith(
        'highlight',
        expect.any(Function),
      );
      expect(mockModule.registerRender).toHaveBeenCalledWith(
        'gutter',
        expect.any(Function),
      );
      expect(mockModule.registerRender).toHaveBeenCalledWith(
        'underline',
        expect.any(Function),
      );
    });
  });

  describe('defaultRenderer', () => {
    it('should return highlight as default renderer when no custom default set', () => {
      const renders = new RenderInstances(mockModule);

      expect(renders.defaultRenderer).toBe('highlight');
    });

    it('should return custom default renderer when set in adapter', () => {
      const customModule = createMockAnnotationModule({
        defaultRenderer: 'underline',
      });

      const renders = new RenderInstances(customModule);

      expect(renders.defaultRenderer).toBe('underline');
    });
  });

  describe('getGutterRenders', () => {
    it('should return empty array when no renderers registered', () => {
      const renders = new RenderInstances(mockModule);

      expect(renders.getGutterRenders()).toEqual([]);
    });

    it('should return only gutter renderers', () => {
      const gutterRenderer = new MockRenderer('margin-note', {
        isGutter: true,
      });
      const textRenderer = new MockRenderer('highlight', { isGutter: false });

      (
        mockModule.getAllRenderInstances as ReturnType<typeof vi.fn>
      ).mockReturnValue([gutterRenderer, textRenderer]);

      const renders = new RenderInstances(mockModule);
      const gutterRenders = renders.getGutterRenders();

      expect(gutterRenders).toHaveLength(1);
      expect(gutterRenders).toContain(gutterRenderer);
      expect(gutterRenders).not.toContain(textRenderer);
    });
  });

  describe('getTextRenders', () => {
    it('should return empty array when no renderers registered', () => {
      const renders = new RenderInstances(mockModule);

      expect(renders.getTextRenders()).toEqual([]);
    });

    it('should return only non-gutter renderers', () => {
      const textRenderer1 = new MockRenderer('highlight', { isGutter: false });
      const textRenderer2 = new MockRenderer('underline', { isGutter: false });
      const gutterRenderer = new MockRenderer('margin-note', {
        isGutter: true,
      });

      (
        mockModule.getAllRenderInstances as ReturnType<typeof vi.fn>
      ).mockReturnValue([textRenderer1, textRenderer2, gutterRenderer]);

      const renders = new RenderInstances(mockModule);
      const textRenders = renders.getTextRenders();

      expect(textRenders).toHaveLength(2);
      expect(textRenders).toContain(textRenderer1);
      expect(textRenders).toContain(textRenderer2);
      expect(textRenders).not.toContain(gutterRenderer);
    });
  });

  describe('getRenderer', () => {
    describe('when renderFn returns a valid renderer name', () => {
      it('should return the matching renderer', () => {
        const underlineRenderer = new MockRenderer('underline');
        const customModule = createMockAnnotationModule({
          renderFn: (ann) => ann.type,
        });
        (customModule.hasRender as ReturnType<typeof vi.fn>).mockReturnValue(
          true,
        );
        (customModule.injectRender as ReturnType<typeof vi.fn>).mockReturnValue(
          underlineRenderer,
        );

        const renders = new RenderInstances(customModule);
        const result = renders.getRenderer({
          id: '1',
          type: 'underline',
        } as any);

        expect(result).toBe(underlineRenderer);
      });
    });

    describe('when renderFn returns null/undefined', () => {
      it('should fall back to default renderer', () => {
        const defaultRenderer = new MockRenderer('highlight');
        const customModule = createMockAnnotationModule({
          renderFn: () => null,
        });
        (customModule.hasRender as ReturnType<typeof vi.fn>).mockReturnValue(
          true,
        );
        (customModule.injectRender as ReturnType<typeof vi.fn>).mockReturnValue(
          defaultRenderer,
        );

        const renders = new RenderInstances(customModule);
        const result = renders.getRenderer({ id: '1', type: 'any' } as any);

        expect(result).toBe(defaultRenderer);
      });
    });

    describe('when renderFn returns a non-existent renderer name', () => {
      it('should fall back to default renderer', () => {
        const defaultRenderer = new MockRenderer('highlight');
        const customModule = createMockAnnotationModule({
          renderFn: (ann) => ann.type,
          defaultRenderer: 'highlight',
        });
        (customModule.hasRender as ReturnType<typeof vi.fn>)
          .mockReturnValueOnce(false) // First call for 'non-existent'
          .mockReturnValueOnce(true); // Second call for default
        (customModule.injectRender as ReturnType<typeof vi.fn>).mockReturnValue(
          defaultRenderer,
        );

        const renders = new RenderInstances(customModule);
        const result = renders.getRenderer({
          id: '1',
          type: 'non-existent',
        } as any);

        expect(result).toBe(defaultRenderer);
      });
    });

    describe('when default renderer is not found', () => {
      it('should throw an error', () => {
        const customModule = createMockAnnotationModule({
          renderFn: () => null,
          defaultRenderer: 'non-existent-default',
        });
        (customModule.hasRender as ReturnType<typeof vi.fn>).mockReturnValue(
          false,
        );

        const renders = new RenderInstances(customModule);

        expect(() => {
          renders.getRenderer({ id: '1', type: 'test' } as any);
        }).toThrow('Default renderer not found: non-existent-default');
      });
    });

    describe('when no renderFn is provided', () => {
      it('should use default renderer', () => {
        const defaultRenderer = new MockRenderer('highlight');
        (mockModule.hasRender as ReturnType<typeof vi.fn>).mockReturnValue(
          true,
        );
        (mockModule.injectRender as ReturnType<typeof vi.fn>).mockReturnValue(
          defaultRenderer,
        );

        const renders = new RenderInstances(mockModule);
        const result = renders.getRenderer({ id: '1', type: 'test' } as any);

        expect(result).toBe(defaultRenderer);
      });
    });
  });

  describe('highlightInstance', () => {
    it('should return the highlight renderer when registered', () => {
      const highlightRenderer = new MockRenderer('highlight');
      (mockModule.injectRender as ReturnType<typeof vi.fn>).mockReturnValue(
        highlightRenderer,
      );

      const renders = new RenderInstances(mockModule);

      expect(renders.highlightInstance).toBe(highlightRenderer);
      expect(mockModule.injectRender).toHaveBeenCalledWith('highlight');
    });
  });

  describe('createDraws', () => {
    it('should call createDraws on the correct renderer', () => {
      const renderer = new MockRenderer('highlight');
      (mockModule.injectRender as ReturnType<typeof vi.fn>).mockReturnValue(
        renderer,
      );

      const renders = new RenderInstances(mockModule);

      const annotation = {
        _render: { render: 'highlight' },
      } as unknown as TextAnnotation;

      renders.createDraws(annotation);

      expect(mockModule.injectRender).toHaveBeenCalledWith('highlight');
      expect(renderer.createDraws).toHaveBeenCalledWith(annotation);
    });

    it('should return the result from the renderer', () => {
      const expectedDraws = {
        draws: [{ type: 'custom', data: 'test' }],
        dimensions: { x: 0, y: 0, width: 50, height: 10 },
        color: { primary: '#fff', border: '#fff' },
      };
      const renderer = new MockRenderer('highlight');
      renderer.createDraws.mockReturnValue(expectedDraws);
      (mockModule.injectRender as ReturnType<typeof vi.fn>).mockReturnValue(
        renderer,
      );

      const renders = new RenderInstances(mockModule);
      const result = renders.createDraws({
        _render: { render: 'highlight' },
      } as unknown as TextAnnotation);

      expect(result).toBe(expectedDraws);
    });

    it('should work with different renderer types', () => {
      const highlightRenderer = new MockRenderer('highlight');
      const underlineRenderer = new MockRenderer('underline');

      (mockModule.injectRender as ReturnType<typeof vi.fn>).mockImplementation(
        (name: string) => {
          if (name === 'highlight') return highlightRenderer;
          if (name === 'underline') return underlineRenderer;
          throw new Error(`Renderer not found: ${name}`);
        },
      );

      const renders = new RenderInstances(mockModule);

      const highlightAnnotation = {
        _render: { render: 'highlight' },
      } as unknown as TextAnnotation;
      const underlineAnnotation = {
        _render: { render: 'underline' },
      } as unknown as TextAnnotation;

      renders.createDraws(highlightAnnotation);
      renders.createDraws(underlineAnnotation);

      expect(highlightRenderer.createDraws).toHaveBeenCalled();
      expect(underlineRenderer.createDraws).toHaveBeenCalled();
    });
  });

  describe('complex scenarios', () => {
    it('should handle mixed gutter and text renderers correctly', () => {
      const textRenderer = new MockRenderer('highlight', { isGutter: false });
      const gutterRenderer = new MockRenderer('margin-note', {
        isGutter: true,
      });

      const customModule = createMockAnnotationModule({
        renderFn: (ann) => ann.renderType ?? ann.type,
      });

      (
        customModule.getAllRenderInstances as ReturnType<typeof vi.fn>
      ).mockReturnValue([textRenderer, gutterRenderer]);

      const renders = new RenderInstances(customModule);

      expect(renders.getTextRenders()).toHaveLength(1);
      expect(renders.getGutterRenders()).toHaveLength(1);
      expect(renders.defaultRenderer).toBe('highlight');
    });

    it('should support dynamic render selection based on annotation properties', () => {
      const highlight = new MockRenderer('highlight');
      const marginNote = new MockRenderer('margin-note', { isGutter: true });
      const underline = new MockRenderer('underline');

      const customModule = createMockAnnotationModule({
        renderFn: (ann) => {
          if (ann.type === 'important') return 'highlight';
          if (ann.type === 'note') return 'margin-note';
          return null;
        },
        defaultRenderer: 'underline',
      });

      (customModule.hasRender as ReturnType<typeof vi.fn>).mockReturnValue(
        true,
      );
      (
        customModule.injectRender as ReturnType<typeof vi.fn>
      ).mockImplementation((name: string) => {
        if (name === 'highlight') return highlight;
        if (name === 'margin-note') return marginNote;
        if (name === 'underline') return underline;
        throw new Error(`Renderer not found: ${name}`);
      });

      const renders = new RenderInstances(customModule);

      expect(renders.getRenderer({ id: '1', type: 'important' } as any)).toBe(
        highlight,
      );
      expect(renders.getRenderer({ id: '2', type: 'note' } as any)).toBe(
        marginNote,
      );
      expect(renders.getRenderer({ id: '3', type: 'other' } as any)).toBe(
        underline,
      );
    });
  });
});
