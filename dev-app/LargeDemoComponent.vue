<script setup lang="ts">
import { computed, ref } from "vue";
import {
  AnnotatedTextV2,
  type Annotation,
  type AnnotationEventType,
  Debugger,
} from "@ghentcdh/vue-component-annotated-text";
import { largeGreekText } from "@demo";

const typesSet = new Set<string>();
largeGreekText.annotations.map((a) => {
  if (a.type) {
    typesSet.add(a.type);
  }
});
const selectedTypes = ref([]);
const annotations = computed(
  () =>
    largeGreekText.annotations
      // .filter((t) => t.id === 1508168)
      .filter((a) => {
        if (selectedTypes.value.length === 0) return true;
        return selectedTypes.value.includes(a.type);
      }) as unknown as Annotation[],
);

const onEvent = (event, eventType: AnnotationEventType, data) => {
  switch (eventType) {
    case "click":
      Debugger.debug("Annotation clicked", event, data);
      break;
  }
};
Debugger.setDebug(true);
const v2Component = ref(true);
const vueComponent = ref(false);
</script>

<template>
  <h4>Vue Large demo component</h4>
  <label>
    <input
      type="checkbox"
      value="true"
      v-model="v2Component"
      @click="() => console.log('V2')"
    />
    V2
  </label>
  <label>
    <input
      type="checkbox"
      value="true"
      v-model="vueComponent"
      @click="() => console.log('text vue')"
    />
    V1
  </label>

  <hr />
  <div class="demo-grid">
    <AnnotatedTextV2
      v-if="v2Component"
      key="text"
      :component-id="'1'"
      :annotations="annotations"
      :text="largeGreekText.text"
      @event="onEvent"
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
