Create a new Vue component following this project's conventions.

`$ARGUMENTS` should contain the component name and optionally the target library/app path.
Format: `ComponentName [path/to/target]`

If no path is given, ask the user where the component should be created.

Follow these conventions strictly:

1. **Create the properties file** (`ComponentName.properties.ts`):
```ts
import type { ExtractPublicPropTypes, PropType } from 'vue';
import { type EmitFn } from 'vue';

export const ComponentNameProperties = {
  // Add props here, always with explicit required: true as const or required: false
  // Example: myProp: { type: String, required: true as const },
};

export type ComponentNameProps = ExtractPublicPropTypes<typeof ComponentNameProperties>;

export const ComponentNameEmits = {
  // Add emits here
};

export type ComponentNameEmitsType = typeof ComponentNameEmits;
export type ComponentNameEmitsFn = EmitFn<ComponentNameEmitsType>;
```

2. **Create the Vue component** (`ComponentName.vue`):
```vue
<template>
  <div>
    <!-- component template -->
  </div>
</template>
<script lang="ts" setup>
import { ComponentNameProperties, ComponentNameEmits } from './ComponentName.properties';

const props = defineProps(ComponentNameProperties);
const emit = defineEmits(ComponentNameEmits);
</script>
```

Key rules:
- `<template>` block comes first, then `<script setup lang="ts">`
- Use `<script lang="ts" setup>` syntax
- Props use Vue object syntax with `PropType`, every prop has explicit `required: true as const` or `required: false`
- Use Tailwind CSS utility classes for styling, no inline styles
- Export the component from the nearest `index.ts` if appropriate
- If the component needs composables, create a `composables/` folder next to it
