# Configuration

While initating the `core` component, you can pass a configuration object to customize its behavior.
Also if something changes in the configuration, you can update it later using the `changeConfig` method.

The configuration object can include the following properties:

<script setup>
//
import { onMounted, onUnmounted, watch, watchEffect } from "vue";
import { DefaultConfig } from "@ghentcdh/vue-component-annotated-text";

</script> 

## Actions

### Create

<blockquote>Allows creating annotations, default is  <code>{{DefaultConfig.actions.edit}}</code></blockquote>

### Edit

<blockquote>Allows editing annotations, default is <code>{{DefaultConfig.actions.edit}}</code>.</blockquote>

## gutter

> Allows adjusting the the gutter dimensions, default is <code>{{DefaultConfig.gutter}}</code>.

## text

> Allows adjusting the the gutter dimensions, default is <code>{{DefaultConfig.text}}</code>.
>

### Right to left

> Allows rendering the text in right to left mode, default is <code>{{DefaultConfig.text.rtl}}</code>.

## Hover

> Allows changing the hover color, default is <code>{{DefaultConfig.hover}}</code>.

## Visual events

### hover

> Allows changing highlighting on hover, by default it always shows the hover color.

Function to determine if the annotation should be highlighted on hover, default is:

```ts
 hover: (annotation: Annotation) => true 
``` 

### create

> Allows to add additional properties to the annotation when it is created, default is:

```ts
create: () => {
  return {
    id: uuidv4(),
    isGutter: false,
    color: createAnnotationColor("#f51720"),
  };
},
```

### useSnapper

> Allows to adjust the start and end of the annotation when it is created or edited, default is:

```ts
snapper: (action, payload) => {
  const { start, end } = payload;
  return { start, end };
}
```

More information about the snapper can be found in the [snapper documentation](../snapper/index).

## Events

> Allows emitting events, default is logging to the console.debug

More information about the events can be found in the [events documentation](event-handlers.md).

```typescript
onEvent: ({ mouseEvent, event, data }: AnnotationEvent) => {
  console.log(mouseEvent, event, data);
}
  ```

:::warning

Add more documentation and examples for the configuration

::: 
