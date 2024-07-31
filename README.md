
# Vue component annotated text

This repository contains a reusable Vue 2 / 3 component to visualize text annotations on web pages. It can be used for linguistic analysis, text structure or other annotations on unicode text. It is best explained by the following screenshots:

![Annotations](docs/annotations.png)

![Edit](docs/editAnnotation.png)


## Usage

Example app can be found in [App.vue](dev-app/App.vue)


## Documentation

To build the docs run `yarn run docs:build`

### Component
- [Props](docs/typedoc/types/Props/interfaces/AnnotatedTextProps.md)
- [Emits](docs/typedoc/types/Emits/interfaces/AnnotatedTextEmits.md)

### Modules

- [StateClasses](docs/typedoc/lib/annotatedTextUtils/StateClasses/README.md)
- [AnnotatedText types](docs/typedoc/types/AnnotatedText/README.md)
- [Annotation types](docs/typedoc/types/Annotation/README.md)

## Creating a new release


To create a new release: first change the version in `package.json`, the file should contain for example `"version": "0.0.16",`. Next, tag the local git repository, push the tag to github and release a branch on GitHub manually.

````
git tag "v0.0.16"
git push origin "v0.0.16"
````


## Credits

Built @ the [Ghent Center For Digital Humanities](https://www.ghentcdh.ugent.be/), Ghent University by:

* Pieterjan De Potter
* Frederic Lamsens
* Joren Six
* Jahid Chetti
