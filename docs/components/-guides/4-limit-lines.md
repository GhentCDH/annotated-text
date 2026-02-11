# Limit lines to display

You can limit the visible lines by passing a `limit` option to the text adapter. The `start` and `end` values define a character range in the text; only lines that intersect this range are displayed.

```typescript
import { createAnnotatedText } from "@ghentcdh/annotated-text";

createAnnotatedText(id)
  .setTextAdapter({ limit: { start: 99, end: 180, ignoreLines: false } })
```

When `ignoreLines` is `false` (the default), every line that overlaps the range is included in full. When set to `true`, only the characters strictly within the `start`/`end` range are shown and line boundaries are ignored.

## Example

<div style="display: grid;
  grid-template-columns: repeat(2, 1fr);gap: 1rem;">
    <strong>Ignore Lines=false</strong>
    <strong>Ignore Lines=true</strong>
    <h4 style="">Plain text</h4>
    <div></div>
    <div id="plaintext--ignore-lines-false"></div>
    <div id="plaintext--ignore-lines"></div>
    <h4 style="">markdown</h4>
    <div></div>
    <div id="markdown--ignore-lines-false"></div>
    <div id="markdown--ignore-lines"></div>
    <h4 style="">Lines</h4>
    <div></div>
    <div id="lines--ignore-lines-false"></div>
    <div id="lines--ignore-lines"></div>
</div>

<script setup>
//
import { onMounted } from "vue";
import { clearAnnotatedTextCache} from "@ghentcdh/annotated-text";
import { limitLinesPlainText, limitLinesMarkdown, limitLinesLineText } from "@demo";


onMounted(()=> {
    clearAnnotatedTextCache();
    limitLinesPlainText(`plaintext--ignore-lines-false`);
    limitLinesPlainText(`plaintext--ignore-lines`, true);
    limitLinesMarkdown(`markdown--ignore-lines-false`);
    limitLinesMarkdown(`markdown--ignore-lines`, true);
    limitLinesLineText(`lines--ignore-lines-false`);
    limitLinesLineText(`lines--ignore-lines`, true);
});
</script>

