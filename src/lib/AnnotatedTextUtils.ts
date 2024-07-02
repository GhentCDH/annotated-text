import {
  AnnotatedTextProps,
  AnnotationActionState,
  type AnnotationLayer,
  ExtendedAnnotation,
} from "@/types";
import { computed } from "vue-demi";
import { Ref } from "vue";

const AnnotationLayerDefaults = {
  weight: null,
  visible: true,
  allowEdit: null,
  allowDelete: null,
  allowCreate: null,
};

const ExtendedAnnotationDefaults = {
  layer: null,
  weight: null,
  visible: true,
  active: false,
};

export default class AnnotatedTextUtils {
  props: AnnotatedTextProps;
  state: Ref<AnnotationActionState>;
  changes: Ref<{}>;

  constructor(
    props: AnnotatedTextProps,
    state: Ref<AnnotationActionState>,
    changes: Ref<{}>
  ) {
    this.props = props;
    this.state = state;
    this.changes = changes;
  }

  layers = computed((): AnnotationLayer[] => {
    this.props.debug && console.log("** refresh layers");

    return this.props.annotationLayers.map(
      (layer) =>
        ({
          AnnotationLayerDefaults,
          ...layer,
        } as AnnotationLayer)
    );
  });

  allAnnotations = computed((): ExtendedAnnotation[] => {
    this.props.debug && console.log("** refresh annotations");

    // upgrade annotations
    let annotations: ExtendedAnnotation[];
    annotations = this.props.annotations.map(
      (annotation) =>
        ({
          ...ExtendedAnnotationDefaults,
          ...annotation,
        } as ExtendedAnnotation)
    );

    // flatten annotations in layers &
    // add reference to annotation layer
    this.layers.value.forEach((layer) => {
      if (layer.visible) {
        const layerAnnotations = layer.annotations.map(
          (annotation) =>
            ({
              ...ExtendedAnnotationDefaults,
              layer: layer,
              ...annotation,
            } as ExtendedAnnotation)
        );
        annotations = annotations.concat(layerAnnotations);
      }
    });

    // make sure computed sees dependent this.state properties
    // if not, first execution won't see them because of conditional
    this.state.value.newStart;
    this.state.value.newEnd;

    // replace objects by proxies, needed to be able
    // to compare annotation (no proxy) with annotation in this.state (proxy)
    // annotations = reactive(annotations);

    // hide invisible annotations
    annotations = annotations.filter(
      (annotation) => annotation?.visible !== false
    );

    // update annotation this.state
    annotations = annotations.map((annotation) => {
      if (this.changes.value?.[annotation.id]) {
        annotation.start = this.changes.value?.[annotation.id].start;
        annotation.end = this.changes.value?.[annotation.id].end;
      }
      return annotation;
    });

    return annotations;
  });
}
