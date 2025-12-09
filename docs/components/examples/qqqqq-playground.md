# Playground

This is a playground for testing and experimenting with various features and functionalities.

<div :id="playgroundId">
</div>

<script setup>
//
import { setupPlayground,} from "@demo";

import { onMounted } from "vue";


const playgroundId = 'playground-div';
onMounted(()=> {
    setupPlayground(playgroundId);
});
</script>
