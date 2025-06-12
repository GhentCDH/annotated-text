<script setup lang="ts">
import { computed, ref } from "vue";
import {
  AnnotatedText,
  Annotation,
  Debugger,
} from "@ghentcdh/vue-component-annotated-text";
import { largeAnnotations, largeTextLines } from "@demo";
import AnnotatedTextV2 from "../src/components/AnnotatedTextV2.vue";
import { AnnotationEventType } from "../src/compute/events";

const typesSet = new Set<string>();
largeAnnotations.map((a) => {
  if (a.type) {
    typesSet.add(a.type);
  }
});
const types = Array.from(typesSet);
const selectedTypes = ref([]);
const annotations = computed(
  () =>
    largeAnnotations
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
    Vue
  </label>
  {{ selectedTypes }}
  <div class="flex">
    <label v-for="type in types" :key="type">
      <input type="checkbox" v-model="selectedTypes" :value="type" />
      {{ type }}
    </label>
  </div>

  <hr />
  <div class="demo-grid">
    <AnnotatedTextV2
      v-if="v2Component"
      key="text"
      :component-id="'1'"
      :annotations="annotations"
      :text-lines="largeTextLines"
      @event="onEvent"
    />
    <AnnotatedText
      v-if="vueComponent"
      @click="console.log('text vue')"
      key="text"
      :component-id="'1'"
      :annotations="annotations"
      :lines="largeTextLines"
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
