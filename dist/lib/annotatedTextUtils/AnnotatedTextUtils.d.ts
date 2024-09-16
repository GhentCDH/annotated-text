import type { AnnotatedLine, AnnotatedTextProps, Annotation, WordPart } from '../../types';
import { UpdateAnnotationState } from '../../lib/annotatedTextUtils/StateClasses';
export declare const startsOnLine: (line: AnnotatedLine, annotation: Annotation) => Boolean;
export declare const endsOnLine: (line: AnnotatedLine, annotation: Annotation) => Boolean;
export declare class CssClassesUtil {
    props: AnnotatedTextProps;
    editAnnotationState: UpdateAnnotationState;
    constructor(props: AnnotatedTextProps, editingAnnotation: UpdateAnnotationState);
    componentClasses: import("vue-demi").ComputedRef<any[]>;
    wordPartClasses: (wordPart: WordPart) => string[];
    annotationGutterClasses: (annotation: Annotation, line: AnnotatedLine) => string[];
    annotationClasses: (annotation: Annotation, start: number, end: number, allowCreate: boolean) => string[];
    private maxAnnotationWeight;
}
