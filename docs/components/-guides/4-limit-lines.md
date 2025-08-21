# Limit lines to display

You can limit the number of lines displayed in the AnnotatedText component, by passing a `limit` option to the
`TextLineAdapter`.
This limit contains a start and end index in the text, which will be used to determine the lines to display.

```typescript
import { createAnnotatedText } from "@ghentcdh/annotated_text";

createAnnotatedText(id,
  {
    text: { limit: { start: 99, end: 180 } }
  })
```

if the property `ignoreLines` is set to `true`, Only the characters between the start and end index will be displayed,
line start and end are ignored.

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
import { clearAnnotatedTextCache} from "@ghentcdh/annotated_text";
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

