# Markdown Utils

## `MarkdownTextAdapter`

Factory function that creates a `MarkdownTextAdapterImpl` instance. This is the main entry point for using markdown text with the `AnnotatedText` component.

Annotation positions are based on the **plain text** content (with markdown syntax stripped), so `abc **test** def` will have the text `test` at position 4-8.

Internally it uses [markdown-it](https://github.com/markdown-it/markdown-it) to parse and render the markdown.

### Usage

```typescript
import { createAnnotatedText } from '@ghentcdh/annotated-text';
import { MarkdownTextAdapter } from '@ghentcdh/annotated-text--markdown';

createAnnotatedText(id)
  .setTextAdapter(MarkdownTextAdapter())
  .setText('hello **bold** world')
  .setAnnotations([...]);
```

### Parameters

`MarkdownTextAdapter` accepts an optional `TextAdapterParams` object:

| Property | Type | Default | Description |
|---|---|---|---|
| `textDirection` | `'ltr' \| 'rtl'` | `'ltr'` | Text direction for the adapter |
| `flatText` | `boolean` | `false` | If `true`, renders plain text instead of HTML |
| `limit` | `{ start: number; end: number }` | `undefined` | Restricts the visible text range to the given character positions |

### Flat text mode

When `flatText` is set to `true`, the adapter strips all HTML and renders the text as plain text. This is useful when you want to display the original text without markdown formatting.

```typescript
MarkdownTextAdapter({ flatText: true })
```

## `selectTextFromMarkdown`

Utility function to extract a portion of markdown text by character range.

```typescript
import { selectTextFromMarkdown } from '@ghentcdh/annotated-text--markdown';

const result = selectTextFromMarkdown(text, start, end, offset);
// result.html          - rendered HTML of the selection
// result.markdownText  - raw markdown of the selection
// result.start         - actual start position
// result.end           - actual end position
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | | The full markdown source text |
| `start` | `number` | | Start character index of the selection |
| `end` | `number` | | End character index of the selection |
| `offset` | `number` | `0` | Character offset to shift the selection range |

## `selectTextInMarkdown`

Selects a text range from markdown by converting it to plain text first. Converts the markdown to HTML, strips the HTML to get flat text, then extracts a prefix/exact/suffix selection around the given character range.

```typescript
import { selectTextInMarkdown } from '@ghentcdh/annotated-text--markdown';

const result = selectTextInMarkdown(markdown, start, end, startOffset);
// result.fullHtml     - full markdown rendered as HTML
// result.fullFlatText - full plain text (HTML stripped)
// result.prefix       - text before the exact selection
// result.exact        - the selected text
// result.suffix       - text after the exact selection
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `markdown` | `string` | | The raw markdown source text |
| `start` | `number` | | Start character index of the selection (in plain text coordinates) |
| `end` | `number` | | End character index of the selection (in plain text coordinates) |
| `startOffset` | `number` | `0` | Character offset to shift the selection range |
