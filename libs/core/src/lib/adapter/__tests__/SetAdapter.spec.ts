import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setAnnotationAdapter, setTextAdapter } from '../SetAdapter';
import { TextAdapter, type TextAdapterParams } from '../text/TextAdapter';
import { AnnotationAdapter, type AnnotationAdapterParams } from '../annotation';
import { type AnnotationModule } from '../../di/annotation.module';
import { AnnotationAdapterToken, TextAdapterToken } from '../../di/tokens';

class MockTextAdapter extends TextAdapter {
  name = 'MockTextAdapter';

  parse() {
    return [];
  }

  override setParams(params: TextAdapterParams) {
    super.setParams(params);
  }
}

class MockAnnotationAdapter extends AnnotationAdapter<any> {
  name = 'MockAnnotationAdapter';

  _parse(annotation: any) {
    return annotation;
  }

  override setParams(params: AnnotationAdapterParams) {
    super.setParams(params);
  }
}

function createMockModule(overrides?: {
  textAdapter?: TextAdapter;
  annotationAdapter?: AnnotationAdapter<any>;
}) {
  const mockTextAdapter = overrides?.textAdapter ?? new MockTextAdapter({});
  const mockAnnotationAdapter =
    overrides?.annotationAdapter ?? new MockAnnotationAdapter({});

  const module = {
    inject: vi.fn((token: any) => {
      throw new Error(`Unknown token: ${String(token)}`);
    }),
    updateAnnotationAdapter: vi.fn().mockReturnThis(),
    updateTextAdapter: vi.fn().mockReturnThis(),
    getTextAdapter: vi.fn(() => mockTextAdapter),
    getAnnotationAdapter: vi.fn(() => mockAnnotationAdapter),
  } as unknown as AnnotationModule;

  return { module, mockTextAdapter, mockAnnotationAdapter };
}

describe('SetAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('setTextAdapter', () => {
    describe('when given a TextAdapter instance', () => {
      it('should call setModule and register the adapter', () => {
        const { module } = createMockModule();
        const adapter = new MockTextAdapter({});
        adapter.setModule = vi.fn();

        const result = setTextAdapter(module, adapter);

        expect(adapter.setModule).toHaveBeenCalledWith(module);
        expect(module.updateTextAdapter()).toHaveBeenCalledWith(
          TextAdapterToken,
          expect.any(Function),
        );
        expect(result).toBe(adapter);
      });

      it('should register a factory that returns the adapter', () => {
        const { module } = createMockModule();
        const adapter = new MockTextAdapter({});
        adapter.setModule = vi.fn();

        setTextAdapter(module, adapter);

        const registerCall = (
          module.updateTextAdapter as ReturnType<typeof vi.fn>
        ).mock.calls[0];
        const factory = registerCall[1];
        expect(factory()).toBe(adapter);
      });
    });

    describe('when given TextAdapterParams', () => {
      it('should inject the existing adapter and call setParams', () => {
        const mockTextAdapter = new MockTextAdapter({});
        mockTextAdapter.setParams = vi.fn();
        const { module } = createMockModule({ textAdapter: mockTextAdapter });

        const params: TextAdapterParams = { textDirection: 'rtl' };
        const result = setTextAdapter(module, params);

        expect(module.inject).toHaveBeenCalledWith(TextAdapterToken);
        expect(mockTextAdapter.setParams).toHaveBeenCalledWith(params);
        expect(result).toBe(mockTextAdapter);
      });

      it('should pass empty params through', () => {
        const mockTextAdapter = new MockTextAdapter({});
        mockTextAdapter.setParams = vi.fn();
        const { module } = createMockModule({ textAdapter: mockTextAdapter });

        setTextAdapter(module, {});

        expect(mockTextAdapter.setParams).toHaveBeenCalledWith({});
      });
    });
  });

  describe('setAnnotationAdapter', () => {
    describe('when given an AnnotationAdapter instance', () => {
      it('should call setModule and register the adapter', () => {
        const { module } = createMockModule();
        const adapter = new MockAnnotationAdapter({});
        adapter.setModule = vi.fn();

        const result = setAnnotationAdapter(module, adapter);

        expect(adapter.setModule).toHaveBeenCalledWith(module);
        expect(module.updateAnnotationAdapter()).toHaveBeenCalledWith(
          AnnotationAdapterToken,
          expect.any(Function),
        );
        expect(result).toBe(adapter);
      });

      it('should register a factory that returns the adapter', () => {
        const { module } = createMockModule();
        const adapter = new MockAnnotationAdapter({});
        adapter.setModule = vi.fn();

        setAnnotationAdapter(module, adapter);

        const registerCall = (
          module.updateAnnotationAdapter as ReturnType<typeof vi.fn>
        ).mock.calls[0];
        const factory = registerCall[1];
        expect(factory()).toBe(adapter);
      });
    });

    describe('when given AnnotationAdapterParams', () => {
      it('should inject the existing adapter and call setParams', () => {
        const mockAnnotationAdapter = new MockAnnotationAdapter({});
        mockAnnotationAdapter.setParams = vi.fn();
        const { module } = createMockModule({
          annotationAdapter: mockAnnotationAdapter,
        });

        const params: AnnotationAdapterParams = { edit: true, create: false };
        const result = setAnnotationAdapter(module, params);

        expect(module.inject).toHaveBeenCalledWith(AnnotationAdapterToken);
        expect(mockAnnotationAdapter.setParams).toHaveBeenCalledWith(params);
        expect(result).toBe(mockAnnotationAdapter);
      });

      it('should pass empty params through', () => {
        const mockAnnotationAdapter = new MockAnnotationAdapter({});
        mockAnnotationAdapter.setParams = vi.fn();
        const { module } = createMockModule({
          annotationAdapter: mockAnnotationAdapter,
        });

        setAnnotationAdapter(module, {});

        expect(mockAnnotationAdapter.setParams).toHaveBeenCalledWith({});
      });
    });
  });
});
