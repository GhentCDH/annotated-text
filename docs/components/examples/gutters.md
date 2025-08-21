# Gutter

<div id="annotated_text--gutters"></div>

<script setup>
//
import { gutters } from "@demo";
import { onMounted, onUnmounted } from "vue";
import { clearAnnotatedTextCache} from "@ghentcdh/annotated_text";

onMounted(()=> {
    clearAnnotatedTextCache();
    gutters('annotated_text--gutters')
})

</script>
