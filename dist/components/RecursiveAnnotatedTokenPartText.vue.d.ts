import type { PropType as __PropType } from 'vue';
declare const _sfc_main: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    componentId: {
        type: __PropType<string>;
        required: true;
    };
    text: {
        type: __PropType<string>;
        required: true;
    };
    start: {
        type: __PropType<number>;
        required: true;
    };
    end: {
        type: __PropType<number>;
        required: true;
    };
    annotations: {
        type: __PropType<import('../types').Annotation[]>;
        required: false;
        default: () => any[];
    };
    annotationClassHandler: {
        type: __PropType<(annotation: import('../types').Annotation, start: number, end: number, allowCreate: boolean) => string[]>;
        required: false;
        default: () => any[];
    };
    wordPartStart: {
        type: __PropType<number>;
        required: true;
    };
    allowEdit: {
        type: __PropType<boolean>;
        required: false;
    };
    allowCreate: {
        type: __PropType<boolean>;
        required: false;
    };
    mouseDownHandler: {
        type: __PropType<(e: MouseEvent, payload?: import("../types/Props").MouseEventPayload) => void>;
        required: true;
    };
    mouseMoveHandler: {
        type: __PropType<(e: MouseEvent, payload?: import("../types/Props").MouseEventPayload) => void>;
        required: true;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    componentId: {
        type: __PropType<string>;
        required: true;
    };
    text: {
        type: __PropType<string>;
        required: true;
    };
    start: {
        type: __PropType<number>;
        required: true;
    };
    end: {
        type: __PropType<number>;
        required: true;
    };
    annotations: {
        type: __PropType<import('../types').Annotation[]>;
        required: false;
        default: () => any[];
    };
    annotationClassHandler: {
        type: __PropType<(annotation: import('../types').Annotation, start: number, end: number, allowCreate: boolean) => string[]>;
        required: false;
        default: () => any[];
    };
    wordPartStart: {
        type: __PropType<number>;
        required: true;
    };
    allowEdit: {
        type: __PropType<boolean>;
        required: false;
    };
    allowCreate: {
        type: __PropType<boolean>;
        required: false;
    };
    mouseDownHandler: {
        type: __PropType<(e: MouseEvent, payload?: import("../types/Props").MouseEventPayload) => void>;
        required: true;
    };
    mouseMoveHandler: {
        type: __PropType<(e: MouseEvent, payload?: import("../types/Props").MouseEventPayload) => void>;
        required: true;
    };
}>> & Readonly<{}>, {
    annotations: import('../types').Annotation[];
    annotationClassHandler: (annotation: import('../types').Annotation, start: number, end: number, allowCreate: boolean) => string[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _sfc_main;
