import "./style/style.scss";

export * from "./compute/model/annotation.config";

export * from "./index.v1";

export type { AnnotationColor } from "./types/AnnotationColor";
export * from "./utils/createAnnotationColor";
export { default as AnnotatedTextV2 } from "./components/AnnotatedTextV2.vue";
export * from "./compute/index";
export * from "./compute/events";
