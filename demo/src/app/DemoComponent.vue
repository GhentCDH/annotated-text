<script setup lang="ts">
// import { annotationsGreek, textGreek as text } from "./data";

import { reactive } from "vue";
import type {
  Annotation,
  AnnotationEventData,
  AnnotationEventType,
  AnnotationId,
  AnnotationTarget,
} from "@ghentcdh/annotated-text";
import { Debugger } from "@ghentcdh/annotated-text";
import { AnnotatedTextV2 } from "@ghentcdh/annotated-text-vue-component";
import { greekText } from "@demo";

const { text, annotations } = greekText;
// .slice(0, 4);

const annotationMap: Map<AnnotationId, Annotation> = annotations
  // .filter((a) => ["576753"].some((i) => i === a.id))
  // .slice(0, 2)
  .reduce((map, anno) => {
    map.set(anno.id, { ...anno });
    return map;
  }, new Map());

const hoveredAnnotationsState: Map<AnnotationId, Annotation> = new Map();
const selectedAnnotations: Map<AnnotationId, Annotation> = new Map();

const props = reactive({
  showLabels: false,
  showSelects: false,
  debug: false,
  verbose: false,
  target: "text" as AnnotationTarget,
  allowEdit: true,
  allowCreate: true,
  renderNested: true,
  /**
   * Lists to pass as props to the component(s). Note, if edits are made to the map state the lists need to be rebuilt.
   * Alternatively instead of using maps to hold the states, lists can also be used, but then operations like updating
   * items in them becomes less clean to implement.
   */
  annoList: Array.from(annotationMap.values()),
  hoveredList: Array.from(hoveredAnnotationsState.keys()),
  selectedList: Array.from(selectedAnnotations.keys()),
  secondComponent: false,
  rtl: false,
});

const onAnnotationEvent = (
  event: MouseEvent,
  type: AnnotationEventType,
  data: AnnotationEventData,
) => {
  switch (type) {
    case "mouse-enter":
      onAnnotationMouseOver(data.annotation, event);
      break;
    case "mouse-leave":
      onAnnotationMouseLeave(data.annotation, event);
      break;
    case "click":
      Debugger.debug("Annotation clicked: ", data.annotation);
      onAnnotationClick(data.annotation, event);
      break;
    case "annotation-edit--end":
      annotationMap.set(data.annotation.id, data.annotation);
      props.annoList = Array.from(annotationMap.values());
      break;
    case "annotation-create--end":
      annotationMap.set(data.annotation.id, data.annotation);
      props.annoList = Array.from(annotationMap.values());
      break;
    default:
      Debugger.warn("Unhandled annotation event type: ", type);
  }
};

const onAnnotationMouseOver = function (
  annotation: Annotation,
  mouseEvent: MouseEvent,
) {
  hoveredAnnotationsState.set(annotation.id, annotation);
  // console.log(hoveredAnnotations);
  props.hoveredList = Array.from(hoveredAnnotationsState.keys());
};

const onAnnotationMouseLeave = function (
  annotation: Annotation,
  mouseEvent: MouseEvent,
) {
  hoveredAnnotationsState.delete(annotation.id);
  props.hoveredList = Array.from(hoveredAnnotationsState.keys());
};

const onAnnotationClick = function (
  annotation: Annotation,
  e: MouseEvent,
): void {
  if (!selectedAnnotations.has(annotation.id)) {
    selectedAnnotations.set(annotation.id, annotation);
  } else {
    selectedAnnotations.delete(annotation.id);
  }
  props.selectedList = Array.from(selectedAnnotations.keys());
};
</script>

<template>
  <h4>Vue component annotated text</h4>
  <menu>
    <form>
      <input v-model="props.debug" type="checkbox" />
      <label>Debug messages</label>
      | <input v-model="props.verbose" type="checkbox" />
      <label>Verbose messages</label>
      | <input v-model="props.showLabels" type="checkbox" />
      <label>Show labels</label>
      | <input v-model="props.showSelects" type="checkbox" />
      <label>Show checkboxes</label>
      | <input v-model="props.renderNested" type="checkbox" />
      <label>Render nested</label>
      | <input v-model="props.allowEdit" type="checkbox" />
      <label>Allow Edits</label>
      | <input v-model="props.allowCreate" type="checkbox" />
      <label>Allow Create</label> |
      <input v-model="props.rtl" type="checkbox" />
      <label>Right-to-left</label>
      | <input v-model="props.secondComponent" type="checkbox" />
      <label>Second Component</label>
    </form>
  </menu>

  <hr />
  <div class="demo-grid">
    <div>
      <h1>V2</h1>
      <AnnotatedTextV2
        v-bind="props"
        key="text"
        :component-id="'1'"
        :annotations="props.annoList"
        :highlight-annotations="props.hoveredList"
        :selected-annotations="props.selectedList"
        :text="text"
        :allow-edit="props.allowEdit"
        :allow-create="props.allowCreate"
        :rtl="props.rtl"
        @event="onAnnotationEvent"
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

.text-components {
  display: flex;
  flex-direction: row;
}
</style>
