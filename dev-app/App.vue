<script setup lang="ts">
import { ref } from "vue";
import DemoComponent from "./DemoComponent.vue";
import LargeDemoComponent from "./LargeDemoComponent.vue";
import GutterDemoComponent from "./GutterDemoComponent.vue";
import RtlComponent from "./RtlComponent.vue";

const largeComponent = ref("demo");
</script>

<template>
  <label>
    <input type="radio" value="demo" v-model="largeComponent" />Demo
  </label>
  <label>
    <input type="radio" value="large" v-model="largeComponent" />Large
  </label>
  <label>
    <input type="radio" value="gutters" v-model="largeComponent" />Gutters
  </label>
  <label>
    <input type="radio" value="rtl" v-model="largeComponent" />Right to Left
  </label>
  <LargeDemoComponent v-if="largeComponent === 'large'" />
  <DemoComponent v-if="largeComponent === 'demo'" />
  <GutterDemoComponent v-if="largeComponent === 'gutters'" />
  <RtlComponent v-if="largeComponent === 'rtl'" />
</template>

<style></style>
