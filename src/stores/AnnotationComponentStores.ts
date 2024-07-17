import { defineStore } from "pinia";
import {
  AnnotationsState, CreateAnnotationState,
  EditAnnotationState
} from "@/lib/annotatedTextUtils/StateClasses";


export const useStateObjectsStore = defineStore("stateObjects", {
  state: () => ({
    annotationsState: {} as AnnotationsState,
    editState: {} as EditAnnotationState,
    createState: {} as CreateAnnotationState,
  }),

  actions: {
    init() {
      this.annotationsState = new AnnotationsState();
      this.editState = new EditAnnotationState();
      this.createState = new CreateAnnotationState();
    },
  },
});
