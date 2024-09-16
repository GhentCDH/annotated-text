import type { PropType as __PropType } from 'vue';
declare const _sfc_main: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    componentId: {
        type: __PropType<string>;
        required: true;
    };
    line: {
        type: __PropType<import('../types').AnnotatedLine>;
        required: true;
    };
    wordPartClasses: {
        type: __PropType<(wordPart: import('../types').WordPart) => any[]>;
        required: false;
        default: () => any[];
    };
    render: {
        type: __PropType<import("../types/AnnotatedText").RenderType>;
        required: false;
        default: string;
    };
    annotationClasses: {
        type: __PropType<(annotation: import('../types').Annotation, start: number, end: number, allowCreate: boolean) => string[]>;
        required: false;
        default: () => any[];
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
    line: {
        type: __PropType<import('../types').AnnotatedLine>;
        required: true;
    };
    wordPartClasses: {
        type: __PropType<(wordPart: import('../types').WordPart) => any[]>;
        required: false;
        default: () => any[];
    };
    render: {
        type: __PropType<import("../types/AnnotatedText").RenderType>;
        required: false;
        default: string;
    };
    annotationClasses: {
        type: __PropType<(annotation: import('../types').Annotation, start: number, end: number, allowCreate: boolean) => string[]>;
        required: false;
        default: () => any[];
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
    wordPartClasses: (wordPart: import('../types').WordPart) => any[];
    render: import("../types/AnnotatedText").RenderType;
    annotationClasses: (annotation: import('../types').Annotation, start: number, end: number, allowCreate: boolean) => string[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _sfc_main;
