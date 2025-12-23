import { cloneDeep } from 'lodash-es';
import { DefaultAnnotationRenderStyle } from './annotation-render';
import { SvgAnnotationRender } from './SvgAnnotationRender';
import { type AnnotationDrawPath } from '../../../model';
import { createAnnotationPath, type PathParams } from '../../../compute';

export const DefaultTextAnnotationRenderStyle = {
  ...cloneDeep(DefaultAnnotationRenderStyle),
  borderWidth: 2,
  borderRadius: 6,
};
export type TextAnnotationRenderStyle = typeof DefaultTextAnnotationRenderStyle;

export class HighlightAnnotationRender extends SvgAnnotationRender<TextAnnotationRenderStyle> {
  readonly weightOrder: number = 1;
  readonly isGutter: boolean = false;

  constructor(name: string, style: Partial<TextAnnotationRenderStyle> = {}) {
    super(name, style, DefaultTextAnnotationRenderStyle);
  }
  override createPath(params: PathParams): AnnotationDrawPath {
    return createAnnotationPath(params);
  }
}
