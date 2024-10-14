# Vue component annotated text

This repository contains a reusable Vue 3 component to visualize text annotations on web pages. It can be used for linguistic analysis, text structure or other annotations on unicode text. It is best explained by the following screenshots:

![Annotations](_media/annotations.png)

![Edit](_media/editAnnotation.png)

## Usage

## Documentation

To build the docs run `pnpm run docs:build`
 

### Slots

Every annotation has 2 named slots: annotation-start and annotation-end. One before the annotation, one after the annotation.

An example usage:
```vue
<AnnotatedText ...>
    <template #annotation-end="slotProps">
      <button>test</button>
    </template>
    <template #annotation-start="slotProps">
        <button>startTest</button>
    </template>
</AnnotatedText>
```

 

## Creating a new release

To create a new release: first change the version in `package.json`, the file should contain for example `"version": "0.0.16",`. Next, tag the local git repository, push the tag to github and release a branch on GitHub manually.

````
git tag "v0.0.16"
git push origin "v0.0.16"
````

## Minimal working example

To get a minimal working example, create a new vue application `npm create vue@latest` and `cd` into the newly created directory. Install the package with your favorite packet manager:  `npm i @ghentcdh/vue-component-annotated-text` and modify `main.ts` to include an import the `css` and paste the following in `App.vue`. After starting with `npm run dev`you should see some annotations.

````html
<!-- 
In main.ts add the following line to import css for the component:

import '@ghentcdh/vue-component-annotated-text/style.css'
-->

<script setup lang="ts">
import {AnnotatedText, type Line, type Annotation, type AnnotationTarget} from '@ghentcdh/vue-component-annotated-text';

const lines = [ {start: 0,end:10, gutter:"1.", text:"0123456789"},
                {start: 11,end:20, gutter:"2.", text:"abcdefghij"},
                {start: 21,end:30, gutter:"3.", text:"klmnopqrst"},
                {start: 31,end:40, gutter:"4.", text:"uvwxyz1234"},
] as Line[];

const annotations = [ {id: "1",
  start: 1,
  end: 7,
  target: "text" as AnnotationTarget},
  {id: "2",
  start: 2,
  end: 9,
  target: "text" as AnnotationTarget},

] as Annotation[];
</script>

<template>˜
 <div>
  <AnnotatedText
      :lines="lines"
      :annotations="annotations"
    >
  </AnnotatedText>
 </div>
</template>

<style scoped>
</style>
````

## Todo

- [ ] update tests
- [ ] update vitepress documentation

## Credits

Built @ the [Ghent Center For Digital Humanities](https://www.ghentcdh.ugent.be/), Ghent University by:

* Pieterjan De Potter
* Frederic Lamsens
* Joren Six
* Jahid Chetti
