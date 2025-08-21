# Greek text with lines inside it

# Selection

## selection from annotated text, starting at the beginning

<div id="lines--all-annotations">
</div>

<script setup>
//
import { linesAllAnnotationInSelection,} from "@demo";

import { onMounted } from "vue";
import { clearAnnotatedTextCache } from "@ghentcdh/annotated_text";

onMounted(()=> {
    clearAnnotatedTextCache();
    linesAllAnnotationInSelection(`lines--all-annotations`);
});
</script>

