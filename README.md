![NPM Version](https://img.shields.io/npm/v/%40ghentcdh%2Fannotated_text?link=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40ghentcdh%2Fannotated_text)
[![Build](https://github.com/GhentCDH/annotated_text/actions/workflows/merge-request.yml/badge.svg)](https://github.com/GhentCDH/annotated_text/actions/workflows/merge-request.yml)
[![Publish](https://github.com/GhentCDH/annotated_text/actions/workflows/publish.yml/badge.svg)](https://github.com/GhentCDH/annotated_text/actions/workflows/publish.yml)

# Component annotated text

This repository contains a reusable Javascript component to visualize text annotations on web pages. It can be used for
linguistic analysis, text structure or other annotations on unicode text. It is best explained by the following
screenshots:

![Annotations](docs/_media/annotations.png)

![Edit](docs/_media/editAnnotation.png)

Following text formats are supported:

- Plain text
- Text divided in lines
- Markdown text

  or Create your own text adapter

Following annotation formats are supported:

- W3C Web Annotation format
- Custom annotation format

  or Create your own annotation adapter

## Usage

## Documentation

To build the docs run `pnpm run docs:build` or access [Github Docs](https://ghentcdh.github.io/annotated_text)

## Creating a new release

Documentation on releases can be found
on: [Release documentation](https://ghentcdh.github.io/annotated_text/release/)

## Minimal working example

More Information in
the [Getting started documentation](https://ghentcdh.github.io/annotated_text/components/-getting-started/quikstart.html)

```scss
@use '@ghentcdh/annotated_text/style.css' as *;
```

````html

<div :id="id"></div>
````

```ts
import { createAnnotatedText } from "@ghentcdh/annotated_text";

const id = `annotated_text-{uuid}`;

const textAnnotation = createAnnotatedText(id)
  .setText(text)
  .setAnnotations(annotations);
```

## Credits

Built @ the [Ghent Center For Digital Humanities](https://www.ghentcdh.ugent.be/), Ghent University by:

* Pieterjan De Potter
* Frederic Lamsens
* Joren Six
* Jahid Chetti
* Bo Vandersteene
