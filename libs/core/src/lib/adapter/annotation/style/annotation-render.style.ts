import { cloneDeep, merge } from 'lodash-es';
import { type CustomAnnotationStyle } from './annotation.style.default';
import {
  DEFAULT_STYLE_NAME,
  DefaultAnnotationStyleParams,
  getAnnotationStyle,
  type StyleFn,
} from './annotation.style';
import { Debugger } from '../../../utils/debugger';

import { type AnnotationStyle } from '../../../model';

export class AnnotationRenderStyle<ANNOTATION> {
  protected readonly styleMap = new Map<string, AnnotationStyle>();
  private defaultStyleName = DEFAULT_STYLE_NAME;
  private styleFn: StyleFn<ANNOTATION> = DefaultAnnotationStyleParams.styleFn;

  constructor(private defaultStyle: CustomAnnotationStyle = {}) {
    this.styleMap.set(
      DEFAULT_STYLE_NAME,
      getAnnotationStyle({} as any, this.defaultStyle),
    );
  }

  registerStyle(name: string, style: CustomAnnotationStyle) {
    this.styleMap.set(name, getAnnotationStyle(this.defaultStyle, style));
  }

  getDefaultStyle(): AnnotationStyle {
    return (this.styleMap.get(this.defaultStyleName) ??
      this.styleMap.get(DEFAULT_STYLE_NAME)) as AnnotationStyle;
  }

  setDefaultStyleName(name: string) {
    if (!this.styleMap.has(name)) {
      Debugger.warn(
        'Style not found: ' + name + '. Default style name remains unchanged.',
      );
      return;
    }
    this.defaultStyleName = name;
  }

  setStyleFn(
    styleFn: (annotation: ANNOTATION) => string | CustomAnnotationStyle | null,
  ) {
    this.styleFn = styleFn;
  }

  getStyle(annotation: ANNOTATION | null) {
    if (!annotation) return this.getDefaultStyle();

    const style = this.styleFn(annotation);

    if (style === null) {
      Debugger.verbose(
        'StyleInstances',
        'No style specified for annotation, returning default style.',
      );

      return this.getDefaultStyle();
    }

    if (typeof style === 'string') {
      const namedStyle = this.styleMap.get(style);
      if (!namedStyle) {
        Debugger.warn(
          'Style not found: ' + style + '. Returning default style.',
        );
        return this.defaultStyle;
      }
      return namedStyle;
    }

    return getAnnotationStyle(this.defaultStyle, style);
  }

  updateDefaultStyle(style: CustomAnnotationStyle) {
    this.defaultStyle = merge(cloneDeep(this.defaultStyle), cloneDeep(style));
  }
}
