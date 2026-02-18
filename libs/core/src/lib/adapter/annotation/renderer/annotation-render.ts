import { cloneDeep, merge } from 'lodash-es';
import {
  type AnnotationDimension,
  type AnnotationDraw,
  type BaseAnnotation,
  type TextAnnotation
} from '../../../model';
import { BaseAnnotationDiFn } from '../../../di/BaseAnnotationDiFn';
import { AnnotationRenderStyle } from '../style/annotation-render.style';
import { type CustomAnnotationStyle } from '../style';

/**
 * Parameters passed to the render method of annotation renderers.
 */
export type AnnotationRenderParams = {
  /**
   * Text direction for proper positioning of annotations.
   * Use 'ltr' for left-to-right languages (English, Spanish, etc.)
   * Use 'rtl' for right-to-left languages (Arabic, Hebrew, etc.)
   */
  textDirection: 'ltr' | 'rtl';

  /**
   * The maximum weight value among all gutter annotations.
   * Useful for positioning gutter elements relative to each other.
   */
  maxGutterWeight: number;
};

/**
 * Configuration parameters for the annotation rendering system.
 *
 * @template ANNOTATION - The type of annotation objects being rendered
 */
export type RenderParams<ANNOTATION> = {
  /**
   * Default renderer to use when renderFn returns null or undefined.
   * Can be a built-in renderer name ('gutter', 'highlight', 'underline')
   * or a custom registered renderer name.
   *
   * @example
   * defaultRenderer: 'highlight'
   */
  defaultRenderer: 'gutter' | 'highlight' | 'underline' | string;

  /**
   * Function that returns the style identifier for a given annotation.
   * The returned string should match a registered style name.
   * Return null to use the default style.
   *
   * @param annotation - The annotation to get the style for
   * @returns The style identifier or null
   *
   * @example
   * styleFn: (annotation) => annotation.style
   * // Returns 'annotation-color-1', 'primary', etc.
   */
  styleFn: (annotation: any) => string | null;

  /**
   * Function that returns the renderer identifier for a given annotation.
   * The returned string should match a registered renderer name.
   * Return null to use the defaultRenderer.
   *
   * @param annotation - The annotation to get the renderer for
   * @returns The renderer identifier or null
   *
   * @example
   * renderFn: (annotation) => annotation.renderer
   * // Returns 'highlight', 'underline', 'gutter', etc.
   */
  renderFn: (
    annotation: ANNOTATION,
  ) => 'gutter' | 'highlight' | 'underline' | string | null;
};

/**
 * Abstract base class for all annotation renderers.
 *
 * Custom renderers must extend this class and implement all abstract members.
 * The class handles style management and provides a contract for rendering annotations.
 *
 * @template STYLE - The style configuration type, must extend AnnotationRenderStyle
 *
 * @example
 * ```typescript
 * class HighlightRenderer extends AnnotationRender<AnnotationRenderStyle> {
 *   weightOrder = 1;
 *   name = 'highlight';
 *   isGutter = false;
 *
 *   constructor() {
 *     super(DefaultAnnotationRenderStyle);
 *   }
 *
 *   render(params, parentDimensions, annotation) {
 *     // Implementation
 *     return { draws, isGutter, startPosition, color };
 *   }
 * }
 * ```
 */
export abstract class AnnotationRender<
  ANNOTATION extends BaseAnnotation,
> extends BaseAnnotationDiFn {
  /**
   * Determines the rendering priority when multiple renderers apply to overlapping annotations.
   *
   * Lower values are rendered first (bottom layer), higher values render on top.
   * Use consistent ranges for different renderer types:
   * - 1-5: Inline background annotations
   * - 6-9: Inline foreground annotations
   * - 10+: Gutter annotations
   *
   * @example
   * weightOrder = 1;  // Background highlight
   * weightOrder = 5;  // Foreground underline
   * weightOrder = 10; // Gutter comment
   */
  abstract weightOrder: number;

  /**
   * Indicates whether this renderer displays content in the gutter (margin)
   * or inline with the text.
   *
   * - true: Renders in the gutter/margin area
   * - false: Renders inline with the text content
   *
   * @default false
   */
  abstract isGutter: boolean;

  /**
   * Indicates whether this renderer should render the tag of the annotation.
   *
   * - true: The renderer is responsible for rendering the annotation's tag (label)
   * - false: The tag will not be renderer by this renderer, allowing for separate tag renderers or no tags at all
   *
   * @default false
   */
  abstract renderTag: boolean;

  public readonly annotationRenderStyle: AnnotationRenderStyle<ANNOTATION>;

  /**
   * Creates a new annotation renderer with the specified default style.
   *
   * The defaultStyle is deep cloned to ensure isolation between instances.
   *
   * @param name - name of the renderer, used for identifying it in the style configuration
   * @param style - Partial style object containing properties to override
   * @param defaultStyle - The default style configuration for this renderer
   *
   * @protected
   */
  protected constructor(
    public readonly name: string,
    defaultStyle: CustomAnnotationStyle,
    style: CustomAnnotationStyle,
  ) {
    super();
    this.annotationRenderStyle = new AnnotationRenderStyle({
      default: merge(cloneDeep(defaultStyle.default), cloneDeep(style.default)),
      edit: merge(cloneDeep(defaultStyle.edit), cloneDeep(style.edit)),
      active: merge(cloneDeep(defaultStyle.active), cloneDeep(style.active)),
      hover: merge(cloneDeep(defaultStyle.hover), cloneDeep(style.hover)),
    });
  }

  /**
   * Renders the annotation and returns draw instructions.
   *
   * This method is called for each annotation that uses this renderer.
   * It should return all information needed to visually represent the annotation.
   *
   * @param params - Rendering parameters including text direction and gutter weight
   * @param textStyle - The text style from the TextAdapter for proper alignment
   * @param parentDimensions - The x and y coordinates of the parent container
   * @param annotation - The annotation being rendered
   *
   * @returns An object containing:
   * - draws: Array of draw instructions (rectangles, lines, text, etc.)
   * - isGutter: Whether this annotation is rendered in the gutter
   * - startPosition: The position and dimensions where rendering starts
   * - color: The color scheme used for drawing
   *
   * @example
   * ```typescript
   * render(params, parentDimensions, annotation) {
   *   return {
   *     draws: [
   *       {
   *         type: 'rect',
   *         x: parentDimensions.x,
   *         y: parentDimensions.y,
   *         width: 100,
   *         height: 20,
   *         fill: 'rgba(255, 0, 0, 0.3)'
   *       }
   *     ],
   *     isGutter: false,
   *     startPosition: { x: 0, y: 0, width: 100, height: 20 },
   *     color: { primary: '#ff0000', border: '#cc0000' }
   *   };
   * }
   * ```
   */
  abstract createDraws(annotation: TextAnnotation): {
    draws: AnnotationDraw[];
    dimensions: AnnotationDimension;
  };

  getStyle(annotation: ANNOTATION) {
    return this.annotationRenderStyle.getStyle(annotation);
  }
}

/**
 * Default style configuration for annotation renderers.
 *
 * Provides sensible defaults for common styling properties used across
 * different renderer types. Custom renderers can extend or override these values.
 *
 * @property hover - Style applied when annotation is hovered
 * @property hover.color.border - Border color on hover
 * @property hover.color.fill - Fill color on hover
 * @property edit - Style applied when annotation is being edited
 * @property edit.color.border - Border color in edit mode */
export const DefaultAnnotationRenderStyle = {
  hover: {
    color: {
      border: 'rgba(100, 100, 100, 0.5)',
      fill: 'rgba(1, 1, 1, 0.1)',
    },
  },
  edit: {
    color: {
      border: 'rgba(255,0,0,0.9)',
    },
  },
};
