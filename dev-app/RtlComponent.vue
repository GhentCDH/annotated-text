<script setup lang="ts">
import { annotations, lines } from "@demo";
import AnnotatedTextV2 from "../src/components/AnnotatedTextV2.vue";

const annotations_ = annotations;
</script>

<template>
  <h4>Vue Lots of annotations component</h4>
  <hr />
  <div class="demo-grid">
    <div>
      Left to Right Text
      <AnnotatedTextV2
        key="text"
        :component-id="'1'"
        :annotations="annotations_"
        :text-lines="lines"
      />
    </div>
    <div>
      Right to left Text
      <AnnotatedTextV2
        key="text"
        :component-id="'1'"
        :annotations="annotations_"
        :text-lines="lines"
        :rtl="true"
      />
    </div>
  </div>
</template>

<style>
body {
  font-family: sans-serif;
  padding: 2em;
}

hr {
  border: 1px solid gray;
  margin-bottom: 1em;
}

menu {
  padding: 0;
}

.filter {
  display: flex;
  gap: 4px;
}
</style>
