<template>
    <span v-if="annotations.length > 1"
          :class="annotationClass(annotations[0])"
          :data-id="annotations[0].id"
          @click.stop="annotationClickHandler(annotations[0])">
        <RecursiveAnnotatedText :annotations="annotations.slice(1)" :text="text" :annotation-click-handler="annotationClickHandler" />
    </span>
    <span v-else
          :class="annotationClass(annotations[0])"
          :data-id="annotations[0].id"
          @click.stop="annotationClickHandler(annotations[0])">{{ text }}</span>
</template>

<script>
export default {
    name: "RecursiveAnnotatedText",
    props: {
        annotations: {
            type: Array,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        annotationClickHandler: {
            type: Function,
            required: true
        },
        activeClass: {
            type: String,
            default: 'annotation--active'
        },
        startClass: {
            type: String,
            default: 'annotation--start'
        },
        endClass: {
            type: String,
            default: 'annotation--end'
        }
    },
    computed: {

    },
    methods: {
        annotationClass(annotation) {
            return [
                annotation.classes,
                annotation?.active ? this.activeClass : '',
                annotation?.isStart ? this.startClass : '',
                annotation?.isEnd ? this.endClass : ''
            ]
        }
    }
}
</script>

<style scoped lang="scss">
</style>