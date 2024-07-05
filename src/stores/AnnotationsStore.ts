import {defineStore} from 'pinia'
import { AnnotatedTextProps, AnnotationActionState } from "@/types";
import { ref } from "vue-demi";
import AnnotatedLinesUtil from "@/lib/annotatedTextUtils/AnnotatedLinesUtil";

export const useAnnotationsStore = defineStore('annotations', {
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
    changes: {},
    linesUtil: undefined as AnnotatedLinesUtil,
  }),


  getters: {
    annotatedLines: (state) => state.linesUtil.annotatedLines,
  },

  actions: {
    // init
    init(props: AnnotatedTextProps,
         // state: Ref<AnnotationActionState>,
         // changes: Ref<{}>
    ){
      this.props = props;
      // this.annotationsState = state;
      // this.changes = changes;
      this.initActionState();
      this.linesUtil = new AnnotatedLinesUtil(props, ref(this.annotationsState), ref(this.changes));
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
      }
    }


  }
});
