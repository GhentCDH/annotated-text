---
AnnotatedText
---

# AnnotatedText

<script setup>
import {
  AnnotatedText,
  Debugger,
  UserActionState,
} from "../../../src";
import { lines } from '../../demo/line';
import { annotations } from '../../demo/annotations-some-gutters';

</script>

## Gutter example
<ClientOnly>
<AnnotatedText
    key="text"
    :component-id="'1'" 
    :annotations="annotations"
    :lines="lines"
/>
</ClientOnly>
