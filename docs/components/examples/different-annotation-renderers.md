# Annotation Renderers

Renderers control how annotations are visually displayed on text. The library includes three built-in renderers:
**highlight** (background color), **underline** (decorative line beneath text) and **gutter** (a box in the gutter).

## Setting the Default Renderer

Configure the default renderer when creating the annotated text instance:

```typescript
createAnnotatedText(id, {
  annotation: {
    defaultRender: 'underline', // or 'highlight'
  },
});
```

## Assigning a Renderer to an Annotation

Each annotation can specify its own renderer:

```typescript
annotation.render = DefaultRenders.highlight;
annotation.render = DefaultRenders.underline;
```

## Custom Renderer Variants

Create variants of the built-in renderers with different visual styles:

```typescript
const thinUnderline = new UnderlineRender('underline-thin', {
  borderWidth: 1
});

const thickUnderline = new UnderlineRender('underline-thick', {
  borderWidth: 5
});

manager.registerRender(thinUnderline);
manager.registerRender(thickUnderline);
```

Once registered, assign custom renderers by name:

```typescript
annotation.render = 'underline-thin';
```

## Example

<div style="display: grid;  grid-template-columns: repeat(2, 1fr);">
    <h4>Default display renderer (highlight)</h4>
<h4>Underline display renderer</h4>
<div :id="id_default"></div>
<div :id="id_line"></div>
    <h4>Thick line renderer</h4>
<h4>Thin line renderer</h4>
<div :id="id_underline_thick"></div>
<div :id="id_underline_thin"></div>
</div>

<script setup>
//
import { onMounted } from "vue";
import { createDifferentAnnotationRenders } from "@demo";
const id_default = `selection-renderer-annotation--default`;
const id_line = `selection-renderer-annotation--line`;
const id_underline_thick = `selection-renderer-annotation--line-thick`;
const id_underline_thin = `selection-renderer-annotation--line-thin`;

onMounted(()=> {
    createDifferentAnnotationRenders(id_default, id_line,id_underline_thick,id_underline_thin);

});
</script>
