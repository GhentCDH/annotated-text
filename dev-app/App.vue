<script setup lang="ts">
import { ref } from "vue";
import DemoComponent from "./DemoComponent.vue";
import LargeDemoComponent from "./LargeDemoComponent.vue";

const largeComponent = ref(false);
</script>

<template>
  <label>
    <input type="checkbox" value="true" v-model="largeComponent" />Large
  </label>
  <LargeDemoComponent v-if="largeComponent" />
  <DemoComponent v-else />
</template>

<style></style>
