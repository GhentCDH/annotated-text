<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="annotated-text" v-if="annotatedLines">
        <div class="annotated-text__line" v-for="line in annotatedLines">
            <template v-if="line?.gutter">
                <span class="greek-text__gutter-text">{{ line?.gutter?.text }}</span>
                <span class="greek-text__gutter-annotations">
                    <span v-for="annotation in line.gutter.annotations" :class="annotation.classes"
                        @click="onClickAnnotation(annotation)"></span>
                </span>
            </template>

            <span class="greek-text__text">
                <template v-for="linePart in line.parts">
                    <span v-if="linePart.annotations.length" class="annotation-wrapper" :key="linePart.start">
                        <RecursiveAnnotatedText :text="linePart.text" :annotations="linePart.annotations"
                            :annotation-click-handler="onClickAnnotation" />
                    </span>
                    <template v-else>{{ linePart.text }}</template>
                </template>
            </span>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { AnnotatedTextProps, Line, Annotation, AnnotationTarget, AnnotatedLine, LinePart, RangeWithAnnotation, RangeWithAnnotations } from "@/types"
import { FlattenRanges } from 'etali'
import RecursiveAnnotatedText from './RecursiveAnnotatedText.vue'

// props
const props = withDefaults(defineProps<AnnotatedTextProps>(), {
    annotations: [] satisfies Annotation[],
    lines: [] satisfies Line[],
    annotationOffset: 0,
    debug: false
})

const annotationEndOffsetFix = 1

// prepare annotations for Etali.FlattenRanges
// etali end position = position of next char not included in range
// ex: in "abcdef", span [0,2] is "ab"
const prepareRanges = (annotations: Annotation[]): RangeWithAnnotation[] => {
    // todo: check why max is needed
    let ranges = annotations.map(annotation => [
        Math.max(0, annotation.start - props.annotationOffset),
        annotation.end + annotationEndOffsetFix - props.annotationOffset,
        annotation
    ] satisfies RangeWithAnnotation)

    return ranges
}

const flattenedRanges = computed((): RangeWithAnnotations[] => {

    // prepare annotations
    let ranges = prepareRanges(props.annotations)

    // add line ranges
    props.lines.forEach((line) => ranges.push([line.start, line.end + 1, null] satisfies RangeWithAnnotation))

    // todo: add token ranges?
    ranges = ranges.sort( (a,b) => ( Number(a[0]) - Number(b[0]) === 0 ? Number(a[1]) - Number(b[1]) : Number(a[0]) - Number(b[0]) ) )
    props.debug && console.log('** ranges **')
    props.debug && console.log(ranges)
    
    // flatten ranges
    let flattenedRanges = FlattenRanges(ranges)
    props.debug && console.log('** flattened ranges **')
    props.debug && console.log(flattenedRanges)
    return flattenedRanges
})

const createAnnotatedLine = function (line: Line): AnnotatedLine {
    let gutterAnnotations = [];

    // get all flattened ranges for this line
    let rangesInScope: RangeWithAnnotations[] = flattenedRanges.value.filter((range: RangeWithAnnotations) => intersectInterval([range[0], range[1] - 1], [line.start, line.end]))

    // get gutter annotations for this line
    for (const range of rangesInScope) {
        range[2]
            .filter(annotation => annotation)
            .filter((annotation) => annotation?.target === "gutter")
            .forEach((annotation) => gutterAnnotations.push(annotation))
    }
    gutterAnnotations = [...new Set(gutterAnnotations)];

    // sort the annotations in each range by their start position
    rangesInScope = rangesInScope.map(function (range) {
        range[2] = range[2]
            .filter(annotation => annotation)    
        // .filter((annotation) => annotation?.target === "span")
            .sort((a, b) => (Number(a?.start) > Number(b?.start)) ? 1 : -1)
        return range
    })

    props.debug && console.log("** ranges in scope **")
    props.debug && console.log(rangesInScope)

    let lineParts: LinePart[] = rangesInScope.map(function (range: RangeWithAnnotations) {
        return {
            start: range[0],
            end: range[1] - 1,
            text: line.text.substring(range[0] - line.start, range[1] - line.start + 1),
            annotations: range[2],
        } satisfies LinePart
    })


    return {
        start: line.start,
        end: line.end,
        parts: lineParts,
        gutter: {
            text: line.gutter,
            annotations: gutterAnnotations
        }
    } satisfies AnnotatedLine
}

const annotatedLines = computed( (): AnnotatedLine[] => {
    let lines = props.lines.map((line) => createAnnotatedLine(line))
    console.log(lines)
    return lines
})

// caculate interval intersection
const intersectInterval = (a: RangeWithAnnotation, b: RangeWithAnnotation): [number, number] | null => {
    const min = a[0] < b[0] ? a : b;
    const max = min == a ? b : a;

    //min ends before max starts -> no intersection
    if (min[1] < max[0]) return null; //the ranges don't intersect

    return [max[0], min[1] < max[1] ? min[1] : max[1]];
}
</script>

<style lang="scss">
.annotation-wrapper {
    border-bottom: 2px solid red;
}
</style>
