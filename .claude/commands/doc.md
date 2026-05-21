Create or update VuePress documentation for a component or feature.

`$ARGUMENTS` should describe the component/feature to document and optionally the target path under `docs/`.

Follow these documentation conventions:

1. Use `::: tabs` / `@tab Preview` / `@tab Vue` for all code examples
2. Structure the page as:
   - **Usage** section with Preview and Vue tabs showing the primary use case
   - **Props/Events** details section
   - `<script setup>` block and `<ClientOnly>` wrapper between details and examples
   - **Examples** section with variants (required, errors, custom keys, etc.) each with Preview and Vue tabs

Example structure:
```md
# ComponentName

Brief description of the component.

## Usage

::: tabs
@tab Preview
<ClientOnly>
  <ComponentName :prop="value" />
</ClientOnly>

@tab Vue
\`\`\`vue
<ComponentName :prop="value" />
\`\`\`
:::

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| prop | String | true | - | Description |

## Events

| Event | Payload | Description |
|-------|---------|-------------|

<script setup>
import { ComponentName } from '@ghentcdh/package';
</script>

## Examples

### Variant Name

::: tabs
@tab Preview
<ClientOnly>
  <ComponentName variant="example" />
</ClientOnly>

@tab Vue
\`\`\`vue
<ComponentName variant="example" />
\`\`\`
:::
```