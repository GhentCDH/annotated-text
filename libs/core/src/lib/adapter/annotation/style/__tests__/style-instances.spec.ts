import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type CustomAnnotationStyle } from '../annotation.style.default';
import {
  DEFAULT_STYLE_NAME,
  DefaultAnnotationStyleParams,
} from '../annotation.style';
import { StyleInstances } from '../style-instances';
import type { AnnotationModule } from '../../../../di/annotation.module';
import { EventListener } from '../../../../events/event.listener';
import { InternalEventListener } from '../../../../events/internal/internal.event.listener';

vi.mock('../../../../utils/debugger', () => ({
  Debugger: {
    verbose: vi.fn(),
    warn: vi.fn(),
  },
}));

interface TestAnnotation {
  id: string;
  type: string;
}

function createMockRenderInstance() {
  return {
    annotationRenderStyle: {
      registerStyle: vi.fn(),
      setDefaultStyleName: vi.fn(),
      setStyleFn: vi.fn(),
    },
  };
}

function createMockModule(
  renderInstances: ReturnType<typeof createMockRenderInstance>[] = [],
) {
  const mockEventListener = { register: vi.fn(), sendEvent: vi.fn() };
  const mockInternalEventListener = { register: vi.fn(), sendEvent: vi.fn() };

  return {
    inject: vi.fn((token: any) => {
      if (token === EventListener) return mockEventListener;
      if (token === InternalEventListener) return mockInternalEventListener;
      throw new Error(`Service not found in mock: ${String(token)}`);
    }),
    getAllRenderInstances: vi.fn().mockReturnValue(renderInstances),
    getTextAdapter: vi.fn().mockReturnValue({ setModule: vi.fn() }),
    getAnnotationAdapter: vi.fn().mockReturnValue({ setModule: vi.fn() }),
    getSnapper: vi.fn(),
  } as unknown as AnnotationModule;
}

const errorStyle: CustomAnnotationStyle = {
  default: { backgroundColor: '#f44336', borderColor: '#f44336' },
  hover: { borderColor: '#d32f2f' },
};

const warningStyle: CustomAnnotationStyle = {
  default: { backgroundColor: '#ff9800', borderColor: '#ff9800' },
};

const infoStyle: CustomAnnotationStyle = {
  default: { backgroundColor: '#2196f3', borderColor: '#2196f3' },
};

describe('StyleInstances', () => {
  let mockModule: AnnotationModule;
  let renderA: ReturnType<typeof createMockRenderInstance>;
  let renderB: ReturnType<typeof createMockRenderInstance>;

  // DefaultAnnotationStyleParams is mutated by lodash merge in setParams,
  // so we need to restore it between tests to avoid leaking state.
  const originalDefaultStyle = DEFAULT_STYLE_NAME;

  beforeEach(() => {
    vi.clearAllMocks();
    DefaultAnnotationStyleParams.defaultStyle = originalDefaultStyle;
    DefaultAnnotationStyleParams.styleFn = () => null;
    renderA = createMockRenderInstance();
    renderB = createMockRenderInstance();
    mockModule = createMockModule([renderA, renderB]);
  });

  describe('registerStyle', () => {
    it.each`
      name         | style
      ${'error'}   | ${errorStyle}
      ${'warning'} | ${warningStyle}
      ${'info'}    | ${infoStyle}
    `(
      'should propagate "$name" style to all render instances',
      ({ name, style }) => {
        const styles = new StyleInstances<TestAnnotation>(mockModule);

        styles.registerStyle(name, style);

        expect(
          renderA.annotationRenderStyle.registerStyle,
        ).toHaveBeenCalledWith(name, style);
        expect(
          renderB.annotationRenderStyle.registerStyle,
        ).toHaveBeenCalledWith(name, style);
      },
    );

    it('should store style in origStyleMap for later propagation', () => {
      const styles = new StyleInstances<TestAnnotation>(mockModule);

      styles.registerStyle('error', errorStyle);
      styles.registerStyle('warning', warningStyle);

      // origStyleMap is protected, verify indirectly via updateAllStyles
      // which re-propagates all stored styles
      vi.clearAllMocks();
      styles.updateAllStyles();

      expect(renderA.annotationRenderStyle.registerStyle).toHaveBeenCalledWith(
        'error',
        errorStyle,
      );
      expect(renderA.annotationRenderStyle.registerStyle).toHaveBeenCalledWith(
        'warning',
        warningStyle,
      );
    });

    it('should overwrite existing style when registering with the same name', () => {
      const styles = new StyleInstances<TestAnnotation>(mockModule);

      styles.registerStyle('error', errorStyle);
      styles.registerStyle('error', warningStyle);

      vi.clearAllMocks();
      styles.updateAllStyles();

      expect(renderA.annotationRenderStyle.registerStyle).toHaveBeenCalledTimes(
        1,
      );
      expect(renderA.annotationRenderStyle.registerStyle).toHaveBeenCalledWith(
        'error',
        warningStyle,
      );
    });
  });

  describe('setParams', () => {
    it.each([
      {
        description: 'styleFn only',
        params: { styleFn: (ann: TestAnnotation) => ann.type },
        expectStyleFnCalled: true,
        expectDefaultStyleCalled: true,
      },
      {
        description: 'defaultStyle only',
        params: { defaultStyle: 'error' },
        expectStyleFnCalled: true,
        expectDefaultStyleCalled: true,
      },
      {
        description: 'both styleFn and defaultStyle',
        params: {
          styleFn: (ann: TestAnnotation) => ann.type,
          defaultStyle: 'warning',
        },
        expectStyleFnCalled: true,
        expectDefaultStyleCalled: true,
      },
    ])(
      'should propagate params to all renders when setting $description',
      ({ params, expectStyleFnCalled, expectDefaultStyleCalled }) => {
        const styles = new StyleInstances<TestAnnotation>(mockModule);

        styles.setParams(params);

        if (expectDefaultStyleCalled) {
          expect(
            renderA.annotationRenderStyle.setDefaultStyleName,
          ).toHaveBeenCalled();
          expect(
            renderB.annotationRenderStyle.setDefaultStyleName,
          ).toHaveBeenCalled();
        }
        if (expectStyleFnCalled) {
          expect(renderA.annotationRenderStyle.setStyleFn).toHaveBeenCalled();
          expect(renderB.annotationRenderStyle.setStyleFn).toHaveBeenCalled();
        }
      },
    );

    it('should set defaultStyle name on render instances', () => {
      const styles = new StyleInstances<TestAnnotation>(mockModule);

      styles.setParams({ defaultStyle: 'error' });

      expect(
        renderA.annotationRenderStyle.setDefaultStyleName,
      ).toHaveBeenCalledWith('error');
      expect(
        renderB.annotationRenderStyle.setDefaultStyleName,
      ).toHaveBeenCalledWith('error');
    });

    it('should set styleFn on render instances', () => {
      const styles = new StyleInstances<TestAnnotation>(mockModule);
      const styleFn = (ann: TestAnnotation) => ann.type;

      styles.setParams({ styleFn });

      expect(renderA.annotationRenderStyle.setStyleFn).toHaveBeenCalledWith(
        styleFn,
      );
      expect(renderB.annotationRenderStyle.setStyleFn).toHaveBeenCalledWith(
        styleFn,
      );
    });

    it('should merge params with existing defaults', () => {
      const styles = new StyleInstances<TestAnnotation>(mockModule);
      const styleFn = (ann: TestAnnotation) => ann.type;

      styles.setParams({ styleFn });
      vi.clearAllMocks();

      styles.setParams({ defaultStyle: 'warning' });

      // styleFn should still be propagated (merged from previous call)
      expect(renderA.annotationRenderStyle.setStyleFn).toHaveBeenCalledWith(
        styleFn,
      );
      expect(
        renderA.annotationRenderStyle.setDefaultStyleName,
      ).toHaveBeenCalledWith('warning');
    });
  });

  describe('updateAllStyles', () => {
    it('should propagate default style name, styleFn, and all registered styles', () => {
      const styles = new StyleInstances<TestAnnotation>(mockModule);
      const styleFn = (ann: TestAnnotation) => ann.type;

      styles.registerStyle('error', errorStyle);
      styles.registerStyle('warning', warningStyle);
      styles.setParams({ styleFn, defaultStyle: 'error' });

      vi.clearAllMocks();
      styles.updateAllStyles();

      for (const render of [renderA, renderB]) {
        expect(
          render.annotationRenderStyle.setDefaultStyleName,
        ).toHaveBeenCalledWith('error');
        expect(render.annotationRenderStyle.setStyleFn).toHaveBeenCalledWith(
          styleFn,
        );
        expect(render.annotationRenderStyle.registerStyle).toHaveBeenCalledWith(
          'error',
          errorStyle,
        );
        expect(render.annotationRenderStyle.registerStyle).toHaveBeenCalledWith(
          'warning',
          warningStyle,
        );
      }
    });

    it('should use DEFAULT_STYLE_NAME when no custom defaultStyle is set', () => {
      const styles = new StyleInstances<TestAnnotation>(mockModule);

      styles.updateAllStyles();

      expect(
        renderA.annotationRenderStyle.setDefaultStyleName,
      ).toHaveBeenCalledWith(DEFAULT_STYLE_NAME);
    });

    it('should propagate to newly added render instances', () => {
      const styles = new StyleInstances<TestAnnotation>(mockModule);
      styles.registerStyle('error', errorStyle);

      const renderC = createMockRenderInstance();
      (
        mockModule.getAllRenderInstances as ReturnType<typeof vi.fn>
      ).mockReturnValue([renderA, renderB, renderC]);

      styles.updateAllStyles();

      expect(renderC.annotationRenderStyle.registerStyle).toHaveBeenCalledWith(
        'error',
        errorStyle,
      );
      expect(
        renderC.annotationRenderStyle.setDefaultStyleName,
      ).toHaveBeenCalled();
      expect(renderC.annotationRenderStyle.setStyleFn).toHaveBeenCalled();
    });

    it('should handle zero render instances without errors', () => {
      const emptyModule = createMockModule([]);
      const styles = new StyleInstances<TestAnnotation>(emptyModule);

      styles.registerStyle('error', errorStyle);

      expect(() => styles.updateAllStyles()).not.toThrow();
    });
  });

  describe('registerStyle + setParams integration', () => {
    it.each([
      {
        description: 'register styles before setParams',
        setup: (styles: StyleInstances<TestAnnotation>) => {
          styles.registerStyle('error', errorStyle);
          styles.registerStyle('warning', warningStyle);
          styles.setParams({
            styleFn: (ann) => ann.type,
            defaultStyle: 'error',
          });
        },
      },
      {
        description: 'register styles after setParams',
        setup: (styles: StyleInstances<TestAnnotation>) => {
          styles.setParams({
            styleFn: (ann) => ann.type,
            defaultStyle: 'error',
          });
          styles.registerStyle('error', errorStyle);
          styles.registerStyle('warning', warningStyle);
        },
      },
    ])(
      'should propagate all data regardless of order ($description)',
      ({ setup }) => {
        const styles = new StyleInstances<TestAnnotation>(mockModule);

        setup(styles);
        vi.clearAllMocks();
        styles.updateAllStyles();

        for (const render of [renderA, renderB]) {
          expect(
            render.annotationRenderStyle.setDefaultStyleName,
          ).toHaveBeenCalledWith('error');
          expect(
            render.annotationRenderStyle.registerStyle,
          ).toHaveBeenCalledWith('error', errorStyle);
          expect(
            render.annotationRenderStyle.registerStyle,
          ).toHaveBeenCalledWith('warning', warningStyle);
        }
      },
    );

    it.each`
      styleNames                      | expected
      ${['error']}                    | ${1}
      ${['error', 'warning']}         | ${2}
      ${['error', 'warning', 'info']} | ${3}
    `(
      'should register $expected style(s) across all renders',
      ({ styleNames, expected }) => {
        const allStyles: Record<string, CustomAnnotationStyle> = {
          error: errorStyle,
          warning: warningStyle,
          info: infoStyle,
        };

        const instances = new StyleInstances<TestAnnotation>(mockModule);

        for (const name of styleNames) {
          instances.registerStyle(name, allStyles[name]);
        }

        expect(
          renderA.annotationRenderStyle.registerStyle,
        ).toHaveBeenCalledTimes(expected);
        expect(
          renderB.annotationRenderStyle.registerStyle,
        ).toHaveBeenCalledTimes(expected);
      },
    );
  });
});
