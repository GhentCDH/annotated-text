<script setup lang="ts">
import {
  AnnotatedText,
  Annotation,
} from "@ghentcdh/vue-component-annotated-text";
import { annotationsWithGutters, lines } from "@demo";
import AnnotatedTextV2 from "../src/components/AnnotatedTextV2.vue";

const annotations = annotationsWithGutters as Annotation[];
</script>

<template>
  <h4>Vue Lots of annotations component</h4>
  <hr />
  <div class="demo-grid">
    <AnnotatedText
      @click="console.log('text vue')"
      key="text"
      :component-id="'1'"
      :annotations="annotations"
      :lines="lines"
    />
    <AnnotatedTextV2
      key="text"
      :component-id="'1'"
      :annotations="annotations"
      :text-lines="lines"
    />
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
