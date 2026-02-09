import { beforeEach, describe, expect, it } from 'vitest';
import { TagRenderer } from '../TagRenderer';
import { type AnnotationModule } from '../../di/annotation.module';

const annotationModuleMock = {
  inject: () => null,
} as unknown as AnnotationModule;

describe('TagRenderer', () => {
  let tagRenderer: TagRenderer<any>;

  beforeEach(() => {
    tagRenderer = new TagRenderer(annotationModuleMock);
  });

  describe('getTagConfig should return null when ', () => {
    it('tagFn is not set', () => {
      const result = tagRenderer.getTagConfig({} as any, {} as any);
      expect(result).toBeNull();
    });

    it('renderInstance.renderTag is not false', () => {
      tagRenderer.setTagFn(() => 'test');
      const result = tagRenderer.getTagConfig(
        {} as any,
        { renderTag: false } as any,
      );
      expect(result).toBeNull();
    });

    it('tagFn returns empty string', () => {
      tagRenderer.setTagFn(() => '');
      const result = tagRenderer.getTagConfig(
        {} as any,
        { renderTag: true } as any,
      );
      expect(result).toBeNull();
    });
  });

  describe('getTagConfig should return tag metadata when ', () => {
    it('tagFn is set, renderInstance supports tags, and tagFn returns non-empty string', () => {
      tagRenderer.setTagFn(() => 'test');
      const result = tagRenderer.getTagConfig(
        {} as any,
        { renderTag: true } as any,
      );
      expect(result).toEqual({
        label: 'test',
        padding: 1,
        fontSize: 8,
        enabledOnHover: true,
      });
    });
  });
});
