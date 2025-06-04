<script setup lang="ts">
import { computed, ref } from "vue";
import {
  AnnotatedText,
  Annotation,
} from "@ghentcdh/vue-component-annotated-text";
import { largeAnntoations, largeTextLines } from "@demo";
import AnnotatedTextPojo from "../src/components/AnnotatedTextPojo.vue";

const typesSet = new Set<string>();
largeAnntoations.map((a) => {
  if (a.type) {
    typesSet.add(a.type);
  }
});
const types = Array.from(typesSet);
const selectedTypes = ref([]);
const annotations = computed(
  () =>
    largeAnntoations.filter((a) => {
      if (selectedTypes.value.length === 0) return true;
      return selectedTypes.value.includes(a.type);
    }) as unknown as Annotation[],
);

const pojoComponent = ref(true);
const vueComponent = ref(false);
</script>

<template>
  <h4>Vue Large demo component</h4>
  <label>
    <input
      type="checkbox"
      value="true"
      v-model="pojoComponent"
      @click="() => console.log('text pojo')"
    />
    POJO
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
  <div class="text-components">
    <AnnotatedTextPojo
      v-if="pojoComponent"
      key="text"
      :component-id="'1'"
      :annotations="annotations"
      :text-lines="largeTextLines"
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
