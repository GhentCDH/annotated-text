# Custom Annotation Rendering

The annotated-text library allows you to create custom renderers to implement unique visual representations for your
annotations beyond the built-in highlight, underline, and gutter renderers.

## Overview

Custom renderers let you:

- Define unique visual styles for annotations
- Control exactly how annotations are drawn using SVG paths
- Set rendering order with weight configuration
- Create reusable renderer classes for your application

## Creating a Custom Renderer

To create a custom renderer, extend the `SvgAnnotationRender` base class and implement the required `createPath` method.

### Basic Structure

```typescript
import {
  type AnnotationDrawPath,
  type PathParams,
  SvgAnnotationRender,
  DefaultUnderlineAnnotationRenderStyle,
} from "@ghentcdh/annotated-text";

export class MyCustomRenderer extends SvgAnnotationRender<any> {
  /** Determines rendering order - lower values render first (behind higher values) */
  readonly weightOrder: number = 1;

  /** Whether this renderer draws in the gutter area */
  readonly isGutter: boolean = false;

  /** Unique identifier for this renderer - used with renderFn */
  static instance = "my-custom-renderer";

  constructor(name: string, style: Partial<any> = {}) {
    super(name, style, DefaultUnderlineAnnotationRenderStyle);
  }

  createPath(params: PathParams): AnnotationDrawPath {
    // Return drawing instructions with border and fill paths
    return {
      border: "...", // SVG path string for the border
      fill: null,    // SVG path string for the fill (or null)
    };
  }
}
```

### Required Properties

| Property      | Type      | Description                                                                          |
|---------------|-----------|--------------------------------------------------------------------------------------|
| `weightOrder` | `number`  | Determines rendering order. Lower values render first (appear behind higher values)  |
| `isGutter`    | `boolean` | Set to `true` if the renderer draws in the gutter area, `false` for inline rendering |

### Example: Custom Underline with End Caps

```typescript
import {
  type AnnotationDrawPath,
  clearAnnotatedTextCache,
  createAnnotatedText,
  createAnnotationFill,
  type createAnnotationPathFn,
  DefaultUnderlineAnnotationRenderStyle,
  type PathParams,
  SvgAnnotationRender,
} from "@ghentcdh/annotated-text";

// Define the custom path function
const createUnderlineWithCaps: createAnnotationPathFn = (
  params: PathParams,
) => {
  const fill = createAnnotationFill(params);
  const { x, y, height, width, leftBorder, rightBorder } = params;

  const path = [];
  const capHeight = 10;
  const baseline = y + height;

  if (leftBorder) {
    path.push(`M ${x} ${baseline - capHeight} v ${capHeight}`);
  }

  path.push(`M ${x} ${baseline} h ${width}`);

  if (rightBorder) {
    path.push(`M ${x + width} ${baseline - capHeight} v ${capHeight}`);
  }

  return {
    border: path.join(" "),
    fill,
  };
};

// Create the custom renderer class
export class MyUnderLineAnnotationRenderer extends SvgAnnotationRender<any> {
  readonly weightOrder: number = 1;
  readonly isGutter: boolean = false;
  fillBg = false;

  static instance = "my-underline-renderer";

  constructor(name: string, style: Partial<any> = {}) {
    super(name, style, DefaultUnderlineAnnotationRenderStyle);
  }

  createPath(params: PathParams): AnnotationDrawPath {
    return createUnderlineWithCaps(params);
  }
}

// Usage
clearAnnotatedTextCache();

createAnnotatedText("container")
  .setRenderParams({
    defaultRenderer: MyUnderLineAnnotationRenderer.instance,
  })
  .registerRender(
    new MyUnderLineAnnotationRenderer(MyUnderLineAnnotationRenderer.instance)
  )
  .setText(text)
  .setAnnotations(annotations);
```

#### Demo custom caps

<div :id="id_default"></div>

### Other examples

Waves renderer:
<div :id="id_waves"></div>

Sketchy renderer:
<div :id="id_sketchy"></div>

<script setup>
//
import { onMounted } from "vue";
import { customAnnotationRender } from "@demo";
const id_default = `selection-custom-annotation--default`;
const id_waves = `selection-custom-annotation--waves`;
const id_sketchy = `selection-custom-annotation--sketchy`;

onMounted(()=> {
    customAnnotationRender(id_default);
    customAnnotationRender(id_waves, 'my-waves-renderer');
    customAnnotationRender(id_sketchy, 'my-sketchy-renderer');
});
</script>
