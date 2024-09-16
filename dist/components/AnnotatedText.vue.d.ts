import type { PropType as __PropType } from 'vue';
import { Annotation } from '../types';
/**
 * @ignore
 */
declare const _sfc_main: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    componentId: {
        type: __PropType<string>;
        required: true;
    };
    text: {
        type: __PropType<string>;
        required: false;
    };
    annotations: {
        type: __PropType<Annotation[]>;
        required: false;
        default: () => any[];
    };
    selectedAnnotations: {
        type: __PropType<string[]>;
        required: false;
        default: () => any[];
    };
    hoveredAnnotations: {
        type: __PropType<string[]>;
        required: false;
        default: () => any[];
    };
    lines: {
        type: __PropType<import('../types').Line[]>;
        required: true;
        default: () => any[];
    };
    annotationOffset: {
        type: __PropType<number>;
        required: false;
        default: number;
    };
    debug: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    verbose: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    theme: {
        type: __PropType<string>;
        required: false;
        default: string;
    };
    render: {
        type: __PropType<import('../types/AnnotatedText').RenderType>;
        required: false;
        default: string;
    };
    display: {
        type: __PropType<import('../types').AnnotationTarget>;
        required: false;
        default: string;
    };
    showLabels: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    autoAnnotationWeights: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    style: {
        type: __PropType<import('../types').AnnotationStyle>;
        required: false;
        default: () => {
            activeClass: string;
            startClass: string;
            endClass: string;
            weightClass: string;
            transitioningClass: string;
            shadowClass: string;
            hoveredClass: string;
        };
    };
    allowEdit: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    allowCreate: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    listenToOnUpdateStart: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    listenToOnUpdating: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    listenToOnKeyPressed: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    listenToOnCreateStart: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    listenToOnCreating: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("annotation-select" | "annotation-update-begin" | "annotation-updating" | "annotation-update-end" | "annotation-create-begin" | "annotation-creating" | "annotation-create-end" | "key-pressed" | "annotation-mouse-over" | "annotation-mouse-leave" | "user-action-state-change")[], "annotation-select" | "annotation-update-begin" | "annotation-updating" | "annotation-update-end" | "annotation-create-begin" | "annotation-creating" | "annotation-create-end" | "key-pressed" | "annotation-mouse-over" | "annotation-mouse-leave" | "user-action-state-change", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    componentId: {
        type: __PropType<string>;
        required: true;
    };
    text: {
        type: __PropType<string>;
        required: false;
    };
    annotations: {
        type: __PropType<Annotation[]>;
        required: false;
        default: () => any[];
    };
    selectedAnnotations: {
        type: __PropType<string[]>;
        required: false;
        default: () => any[];
    };
    hoveredAnnotations: {
        type: __PropType<string[]>;
        required: false;
        default: () => any[];
    };
    lines: {
        type: __PropType<import('../types').Line[]>;
        required: true;
        default: () => any[];
    };
    annotationOffset: {
        type: __PropType<number>;
        required: false;
        default: number;
    };
    debug: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    verbose: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    theme: {
        type: __PropType<string>;
        required: false;
        default: string;
    };
    render: {
        type: __PropType<import('../types/AnnotatedText').RenderType>;
        required: false;
        default: string;
    };
    display: {
        type: __PropType<import('../types').AnnotationTarget>;
        required: false;
        default: string;
    };
    showLabels: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    autoAnnotationWeights: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    style: {
        type: __PropType<import('../types').AnnotationStyle>;
        required: false;
        default: () => {
            activeClass: string;
            startClass: string;
            endClass: string;
            weightClass: string;
            transitioningClass: string;
            shadowClass: string;
            hoveredClass: string;
        };
    };
    allowEdit: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    allowCreate: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    listenToOnUpdateStart: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    listenToOnUpdating: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    listenToOnKeyPressed: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    listenToOnCreateStart: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
    listenToOnCreating: {
        type: __PropType<boolean>;
        required: false;
        default: boolean;
    };
}>> & Readonly<{
    "onAnnotation-select"?: (...args: any[]) => any;
    "onAnnotation-update-begin"?: (...args: any[]) => any;
    "onAnnotation-updating"?: (...args: any[]) => any;
    "onAnnotation-update-end"?: (...args: any[]) => any;
    "onAnnotation-create-begin"?: (...args: any[]) => any;
    "onAnnotation-creating"?: (...args: any[]) => any;
    "onAnnotation-create-end"?: (...args: any[]) => any;
    "onKey-pressed"?: (...args: any[]) => any;
    "onAnnotation-mouse-over"?: (...args: any[]) => any;
    "onAnnotation-mouse-leave"?: (...args: any[]) => any;
    "onUser-action-state-change"?: (...args: any[]) => any;
}>, {
    render: import('../types/AnnotatedText').RenderType;
    allowEdit: boolean;
    allowCreate: boolean;
    annotations: Annotation[];
    selectedAnnotations: string[];
    hoveredAnnotations: string[];
    lines: import('../types').Line[];
    annotationOffset: number;
    debug: boolean;
    verbose: boolean;
    theme: string;
    display: import('../types').AnnotationTarget;
    showLabels: boolean;
    autoAnnotationWeights: boolean;
    style: import('../types').AnnotationStyle;
    listenToOnUpdateStart: boolean;
    listenToOnUpdating: boolean;
    listenToOnKeyPressed: boolean;
    listenToOnCreateStart: boolean;
    listenToOnCreating: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _sfc_main;
