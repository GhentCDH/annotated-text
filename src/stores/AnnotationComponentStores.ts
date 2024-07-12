import { defineStore } from "pinia";
import { AnnotationActionState } from "@/types";
import {
  AnnotationsState,
  EditAnnotationState,
} from "@/lib/annotatedTextUtils/StateClasses";

export const useEditAnnotationsStore = defineStore("edits", {
  state: () => ({
    annotationsState: {
      action: null,
      handlePosition: null,
      annotation: null,
      origEnd: null,
      origStart: null,
      newEnd: null,
      newStart: null,
    } as AnnotationActionState,
  }),

  getters: {},

  actions: {
    // init
    init() {
      this.resetActionState();
    },
    resetActionState() {
      this.annotationsState = {
        action: null,
        handlePosition: null,
        annotation: null,
        origEnd: null,
        origStart: null,
        newEnd: null,
        newStart: null,
      };
    },
  },
});

export const useStateObjectsStore = defineStore("stateObjects", {
  state: () => ({
    annotationsState: {} as AnnotationsState,
    editState: {} as EditAnnotationState,
  }),

  actions: {
    init() {
      this.annotationsState = new AnnotationsState();
      this.editState = new EditAnnotationState();
    },
  },
});
