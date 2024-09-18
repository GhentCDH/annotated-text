**@ghentcdh/vue-component-annotated-text** • [**Docs**](modules.md)

***

# Vue component annotated text

This repository contains a reusable Vue 3 component to visualize text annotations on web pages. It can be used for linguistic analysis, text structure or other annotations on unicode text. It is best explained by the following screenshots:

![Annotations](_media/annotations.png)

![Edit](_media/editAnnotation.png)

## Usage

Example app can be found in [App.vue](_media/App.vue)

## Documentation

To build the docs run `yarn run docs:build`

### AnnotatedText Component
- [Props](_media/AnnotatedTextProps.md)
- [Emits](_media/AnnotatedTextEmits.md)

### Types

- [StateClasses](_media/README.md)
- [AnnotatedText](_media/README-1.md)
- [Annotation](_media/README-2.md)

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

the slotProps argument is an object that looks like this:
{
  annotation: [Annotation](docs/typedoc/types/Annotation/interfaces/Annotation.md)
}

## Creating a new release

To create a new release: first change the version in `package.json`, the file should contain for example `"version": "0.0.16",`. Next, tag the local git repository, push the tag to github and release a branch on GitHub manually.

````
git tag "v0.0.16"
git push origin "v0.0.16"
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
