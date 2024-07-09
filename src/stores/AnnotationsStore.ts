import { defineStore } from "pinia";
import {
  AnnotatedTextProps,
  AnnotationActionPayload,
  AnnotationActionState,
} from "@/types";
import { ref } from "vue-demi";
import AnnotatedLinesUtil from "@/lib/annotatedTextUtils/AnnotatedLinesUtil";

export const useAnnotationsStore = defineStore("annotations", {
  state: () => ({
    props: undefined as AnnotatedTextProps,
    annotationsState: {
      action: null,
      handlePosition: null,
      annotation: null,
      origEnd: null,
      origStart: null,
      newEnd: null,
      newStart: null,
    } as AnnotationActionState,
    createAnnotationStateStart: null as null | number,
    linesUtil: undefined as AnnotatedLinesUtil,
  }),

  getters: {
    annotatedLines: (state) => state.linesUtil.annotatedLines,
  },

  actions: {
    // init
    init(props: AnnotatedTextProps) {
      this.props = props;
      this.initActionState();
      this.initCreateState();
      this.linesUtil = new AnnotatedLinesUtil(
        props,
        ref(this.annotationsState)
      );
    },
    initActionState() {
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
    initCreateState() {
      this.createAnnotationStateStart = null;
    },

    // Events
    onMouseLeaveHandler(e: MouseEvent) {
      // reset state?
      if (this.annotationsState.action) {
        this.initActionState();
      }
      console.log("global mouseleave");
    },

    onAnnotationStartHandler(e: MouseEvent, payload: AnnotationActionPayload) {
      console.log(`start resize (${payload.action})`);
      this.annotationsState = {
        ...payload,
        origStart: payload.annotation.start,
        origEnd: payload.annotation.end,
        newStart: payload.annotation.start,
        newEnd: payload.annotation.end,
      };
    },
  },
});
