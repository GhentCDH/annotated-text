# Right to left

:::info
Right to left support is currently in beta mode.
:::

Enabling right to left rendering in the AnnotatedText component allows for proper display of languages that are read
from right to left, such as Arabic or Hebrew. This is particularly useful for applications that need to support
multilingual text.

Rtl can be configured in the AnnotatedText component by setting the `text.rtl` property to `true`. This will ensure that
the text is rendered correctly in a right-to-left format.

```typescript
createAnnotatedText(id,
  {
    text: { textDirection: 'rtl' }
  })
  .setText(text)
  .setAnnotations(textAnnotations);
```

### Example

<div id="plain-text-example"></div>

<script setup>
//
import { onMounted } from "vue";
import { createAnnotatedText, TextLineAdapter, clearAnnotatedTextCache} from "@ghentcdh/vue-component-annotated-text";
import { plainText, greekText } from "@demo";
const id = `plain-text-example`;
const greek_id = `greek-text-example`;

onMounted(()=> {
    clearAnnotatedTextCache()
    createAnnotatedText(id,
        {  
            text: { textDirection: 'rtl' },
            annotation: {edit: true, create: true},
        })
    .setText(plainText.text)
    .setAnnotations(plainText.annotations);

    createAnnotatedText(greek_id,
        {  
            text: TextLineAdapter({ textDirection: 'rtl' }),
            annotation: {edit: true, create: true},
        })
    .setText(greekText.text)
    .setAnnotations(greekText.annotations);
});

</script>

### Example with line numbers text

If you use the `TextLineAdapter`, you can also enable right to left rendering by setting the `textDirection` property to
`rtl`.

```typescript
 createAnnotatedText(id, {
  text: TextLineAdapter({ textDirection: 'rtl' })
})
```

<div id="greek-text-example"></div>
