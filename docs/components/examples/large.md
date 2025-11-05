# Large dataset

<div id="annotated-text--large">
loading ....
</div>

<script setup>
//
import { largeText } from "@demo";

import { onMounted } from "vue";
import { clearAnnotatedTextCache} from "@ghentcdh/annotated-text";

onMounted(()=> {
    clearAnnotatedTextCache();
    largeText('annotated-text--large')
});
</script>
