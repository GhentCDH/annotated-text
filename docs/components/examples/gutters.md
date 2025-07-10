# Gutter

<div id="annotated-text--gutters"></div>

<script setup>
//
import { gutters } from "@demo";
import { onMounted, onUnmounted } from "vue";
import { clearAnnotatedTextCache} from "@ghentcdh/vue-component-annotated-text";

onMounted(()=> {
    clearAnnotatedTextCache();
    gutters('annotated-text--gutters')
})

</script>
