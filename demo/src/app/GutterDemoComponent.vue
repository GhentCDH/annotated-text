<script setup lang="ts">
import { AnnotatedTextV2 } from "@ghentcdh/annotated-text-vue-component";
import { Annotation } from "@ghentcdh/annotated-text";
import { greekText } from "@demo";

const annotations = greekText.annotationsWithGutters as Annotation[];
</script>

<template>
  <h4>Vue Lots of annotations component</h4>
  <hr />
  <div class="demo-grid">
    <AnnotatedTextV2
      key="text"
      :component-id="'1'"
      :annotations="annotations"
      :text="greekText.text"
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
