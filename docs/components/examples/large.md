# Large dataset

<div id="annotated_text--large"></div>

<script setup>
//
import { largeText } from "@demo";

import { onMounted } from "vue";
import { clearAnnotatedTextCache} from "@ghentcdh/annotated_text";

onMounted(()=> {
    clearAnnotatedTextCache();
    largeText('annotated_text--large')
});
</script>
