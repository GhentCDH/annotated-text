import { defineStore } from "pinia";
import {
  CreateAnnotationState,
  UpdateAnnotationState,
  HoverAnnotationsState,
} from "@/lib/annotatedTextUtils/StateClasses";
import { ref } from "vue";

export const useStateObjectsStore = (componentId: string) =>
  defineStore(`stateObjects-${componentId}`, () => {
    const updateState = ref(new UpdateAnnotationState());
    const createState = ref(new CreateAnnotationState());
    const hoverState = ref(new HoverAnnotationsState());

    return { updateState, createState, hoverState };
  });
