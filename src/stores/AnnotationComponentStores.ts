import { defineStore } from "pinia";
import {
  CreateAnnotationState,
  EditAnnotationState,
  HoverAnnotationsState,
} from "@/lib/annotatedTextUtils/StateClasses";
import { ref } from "vue";

export const useStateObjectsStore = (componentId: string) =>
  defineStore(`stateObjects-${componentId}`, () => {
    const editState = ref(new EditAnnotationState());
    const createState = ref(new CreateAnnotationState());
    const hoverState = ref(new HoverAnnotationsState());

    return { editState, createState, hoverState };
  });
