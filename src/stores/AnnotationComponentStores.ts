import { defineStore } from "pinia";
import {
  AnnotationsState,
  CreateAnnotationState,
  EditAnnotationState,
  HoverAnnotationsState,
} from "@/lib/annotatedTextUtils/StateClasses";

export const useStateObjectsStore = defineStore("stateObjects", {
  state: () => ({
    annotationsState: new AnnotationsState(),
    editState: new EditAnnotationState(),
    createState: new CreateAnnotationState(),
    hoverState: new HoverAnnotationsState(),
  }),
});
