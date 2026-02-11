import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  setAnnotationAdapter,
  setSnapperAdapter,
  setTextAdapter,
} from '../SetAdapter';
import { TextAdapter, type TextAdapterParams } from '../text/TextAdapter';
import { AnnotationAdapter, type AnnotationAdapterParams } from '../annotation';
import { type AnnotationModule } from '../../di/annotation.module';
import { type Snapper } from '../snapper';

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
    updateSnapper: vi.fn().mockReturnThis(),
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
      it('should call updateTextAdapter with the adapter', () => {
        const { module } = createMockModule();
        const adapter = new MockTextAdapter({});

        const result = setTextAdapter(module, adapter);

        expect(module.updateTextAdapter).toHaveBeenCalledWith(adapter);
        expect(result).toBe(adapter);
      });
    });

    describe('when given TextAdapterParams', () => {
      it('should get the existing adapter and call setParams', () => {
        const mockTextAdapter = new MockTextAdapter({});
        mockTextAdapter.setParams = vi.fn();
        const { module } = createMockModule({ textAdapter: mockTextAdapter });

        const params: TextAdapterParams = { textDirection: 'rtl' };
        const result = setTextAdapter(module, params);

        expect(module.getTextAdapter).toHaveBeenCalled();
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
      it('should call updateAnnotationAdapter with the adapter', () => {
        const { module } = createMockModule();
        const adapter = new MockAnnotationAdapter({});

        const result = setAnnotationAdapter(module, adapter);

        expect(module.updateAnnotationAdapter).toHaveBeenCalledWith(adapter);
        expect(result).toBe(adapter);
      });
    });

    describe('when given AnnotationAdapterParams', () => {
      it('should get the existing adapter and call setParams', () => {
        const mockAnnotationAdapter = new MockAnnotationAdapter({});
        mockAnnotationAdapter.setParams = vi.fn();
        const { module } = createMockModule({
          annotationAdapter: mockAnnotationAdapter,
        });

        const params: AnnotationAdapterParams = { edit: true, create: false };
        const result = setAnnotationAdapter(module, params);

        expect(module.getAnnotationAdapter).toHaveBeenCalled();
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

  describe('setSnapperAdapter', () => {
    it('should call updateSnapper on the module', () => {
      const { module } = createMockModule();
      const snapper = { setText: vi.fn() } as unknown as Snapper;

      setSnapperAdapter(module, snapper, 'hello world');

      expect(module.updateSnapper).toHaveBeenCalledWith(snapper);
    });

    it('should call setText with the text and annotationAdapter startOffset', () => {
      const mockAnnotationAdapter = new MockAnnotationAdapter({});
      mockAnnotationAdapter.startOffset = 5;
      const { module } = createMockModule({
        annotationAdapter: mockAnnotationAdapter,
      });
      const snapper = { setText: vi.fn() } as unknown as Snapper;

      setSnapperAdapter(module, snapper, 'hello world');

      expect(snapper.setText).toHaveBeenCalledWith('hello world', 5);
    });

    it('should return the snapper', () => {
      const { module } = createMockModule();
      const snapper = { setText: vi.fn() } as unknown as Snapper;

      const result = setSnapperAdapter(module, snapper, 'hello world');

      expect(result).toBe(snapper);
    });
  });
});