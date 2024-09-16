import { type AnnotatedLine, AnnotatedTextProps } from '../../types';
import { CreateAnnotationState, UpdateAnnotationState } from '../../lib/annotatedTextUtils/StateClasses';
export default class AnnotatedLinesUtil {
    props: AnnotatedTextProps;
    editState: UpdateAnnotationState;
    createState: CreateAnnotationState;
    constructor(props: AnnotatedTextProps, editState: UpdateAnnotationState, createState: CreateAnnotationState);
    private allAnnotations;
    private gutterAnnotations;
    private prepareRanges;
    private calculateAnnotationWeights;
    private calculateGutterAnnotationWeights;
    private flattenedRanges;
    private createAnnotatedWord;
    private createAnnotatedLine;
    annotatedLines: import("vue-demi").ComputedRef<AnnotatedLine[]>;
}
