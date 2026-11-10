# Zoom

Zoom the annotated text without zooming the whole page, e.g. to read a small
script while comparing it with an external edition. The text reflows to the
width of its container and the annotations are redrawn to match.

## Zoom controls

Enable the built-in controls with `setZoomControls`. All controls are off by default.

```ts
createAnnotatedText(id)
  .setText(text)
  .setAnnotations(annotations)
  .setZoomControls({
    buttons: true, // − / % / + buttons in the top corner of the text, click % to reset
    wheel: true, // Ctrl/Cmd + mouse wheel and trackpad pinch, zooms around the pointer
    keyboard: true, // Ctrl/Cmd + '+' / '-' / '0' while the text has focus
    min: 0.5,
    max: 4,
    step: 0.25,
  });
```

| Option     | Default | Description                                                                             |
|------------|---------|-----------------------------------------------------------------------------------------|
| `buttons`  | `false` | Show zoom out, zoom level (click to reset) and zoom in buttons on top of the text       |
| `wheel`    | `false` | Zoom with Ctrl/Cmd + mouse wheel or trackpad pinch over the text. A plain wheel scrolls |
| `keyboard` | `false` | Zoom with Ctrl/Cmd + `+` / `-` / `0` while the text has focus                           |
| `min`      | `0.5`   | Minimum zoom                                                                            |
| `max`      | `4`     | Maximum zoom                                                                            |
| `step`     | `0.25`  | Zoom step for the buttons and the keyboard                                              |

The buttons stick to the top of the scroll container. They sit on the side where
lines end (right for left-to-right text, left for right-to-left text). Restyle them
with the `.ghent-cdh-annotation-zoom` class or the `--annotated-text-zoom-border`,
`--annotated-text-zoom-background`, `--annotated-text-zoom-color` and
`--annotated-text-zoom-top` CSS variables.

## Your own controls

```ts
annotatedText.setZoom(1.5); // zoom factor, 1 is the normal size
annotatedText.getZoom(); // 1.5

annotatedText.on('zoom', ({ data }) => {
  console.log('zoom changed to', data.zoom);
});
```

`setZoom` keeps the text in the middle of the visible area in place, so the reader
doesn't lose their position. Pass a viewport point as second argument to keep the
text under that point in place instead: `setZoom(2, { x: event.clientX, y: event.clientY })`.

::: tip
Put the text in a container with a fixed height and `overflow: auto`, so zooming
scrolls the text and not the page. Add `resize: vertical` to let the user resize it.
:::

## Example

Use the buttons, Ctrl/Cmd + mouse wheel, or a trackpad pinch over the text. The box can be resized from the bottom-right corner.

<div id="annotated-zoom"></div>

<script setup>
import { onMounted } from "vue";

import { clearAnnotatedTextCache } from "@ghentcdh/annotated-text";
import { zoomText } from "@demo";

onMounted(() => {
    clearAnnotatedTextCache();
    zoomText('annotated-zoom');
});
</script>
