import {
  AnnotationDrawColor,
  AnnotationEventType,
  type AnnotationId,
} from "@ghentcdh/annotated-text";
import { TextAnnotation } from "../../model";

export type InternalEventData = {
  "annotation--draw-dummy": {
    dummyAnnotation: TextAnnotation;
    color: AnnotationDrawColor;
  };
  "send-event--annotation": {
    event: AnnotationEventType;
    mouseEvent?: MouseEvent;
    annotationUuid: AnnotationId;
    additionalData?: any;
  };
  "annotation--set-class": {
    annotationUuid: AnnotationId;
    cssClass: string;
  };
  "annotation--remove-tag": {
    annotationUuid: AnnotationId;
  };
  "annotation--remove": {
    annotationUuid: AnnotationId;
    selector?: string;
  };
  "annotation--add": {
    annotation: TextAnnotation;
  };
  "annotation--update": {
    annotation: TextAnnotation;
  };
};

export type InternalEvent = keyof InternalEventData;
