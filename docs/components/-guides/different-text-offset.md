# Custom Text Index Offset

The annotated-text library supports custom text indexing offsets to align with different scholarly and editorial
workflows. By default, text uses zero-based indexing (starting at 0), but you can configure it to start at 1 or any
other value.

### The Problem

Zero-based indexing is standard in programming, but many academic and editorial contexts reference text positions
starting from 1. For example:

- **FileMaker** uses 1-based indexing ([documentation](https://help.claris.com/en/pro-help/content/position.html))
- **Scholarly editions** often reference character or word positions starting from 1
- **Editorial workflows** may use 1-based positions for manuscript annotations
- **W3C Web Annotation** uses 0-based indexing, which can cause confusion when integrating with other systems that use
  1-based indexing
- Other markup standards often use 0-based counting

This mismatch requires constant mental translation and can lead to errors when creating or validating annotations.

### Solution: Start Offset Configuration

Configure a custom offset for text character indexing using the `startOffset` option on the annotation adapter:

```typescript
createAnnotatedText(id)
  .setAnnotationAdapter({ startOffset: 1 })
  .setText(text)
  .setAnnotations(annotations);
```

### How It Works

When you set a `startOffset`:

- **Display layer**: Text positions are shown with the offset applied (e.g., first character is position 1)
- **Internal layer**: Zero-based indexing is maintained internally for processing
- **Annotations**: Use the offset-adjusted positions when defining start/end values

### Basic Usage

**1-based indexing (most common for scholarly work):**

```typescript
const text = "Hello world";

const annotations = [
  {
    start: 1,    // First character 'H'
    end: 5,      // Last character 'o'
  },
  {
    start: 7,    // First character 'w'
    end: 11,     // Last character 'd'
  }
];

createAnnotatedText(id)
  .setAnnotationAdapter({ startOffset: 1 })
  .setText(text)
  .setAnnotations(annotations);
```

**Default behavior (0-based indexing):**

```typescript
// Without startOffset, or with startOffset: 0
const annotations = [
  {
    start: 0,    // First character 'H'
    end: 4,      // Last character 'o'
  }
];

createAnnotatedText(id)
  .setText(text)
  .setAnnotations(annotations);
```

### Use Cases

#### FileMaker Integration

Align with FileMaker's Position function:

```typescript
// Match FileMaker's 1-based Position() function
createAnnotatedText("filemaker-text")
  .setAnnotationAdapter({ startOffset: 1 });
```

#### Custom Offsets

Support arbitrary starting positions:

```typescript
// Start at position 100 (e.g., continuing from a previous section)
createAnnotatedText("section-2")
  .setAnnotationAdapter({ startOffset: 100 });
```

### Important Considerations

1. **Consistency**: Use the same offset throughout your application or clearly document when offsets change
2. **Data Import/Export**: When importing annotations from external sources, ensure their indexing matches your
   configured offset
3. **API Responses**: If your backend uses 0-based indexing, convert positions when setting annotations
4. **Documentation**: Clearly communicate the indexing convention to users and collaborators

### Default Behavior

When `startOffset` is not specified or set to `0`:

- Text indexing starts at 0
- Standard zero-based indexing is used throughout
- This is the default behavior and matches most programming conventions

## Example

In this example, we demonstrate three different text offsets: 0, 1, and 10. For each offset, the same annotation array
is applied, to demonstrate how the starting index affects the annotation positions.

### Plain text

<div style="display: grid;  grid-template-columns: repeat(3, 1fr);">
    <h4>Offset of 0</h4>
    <h4>Offset of 1</h4>
    <h4>Offset of 10</h4>
    <div :id="id_no_offset"></div>
    <div :id="id_offset_1"></div>
    <div :id="id_offset_10"></div>
</div>

<script setup>
//
</script>

### Wordsnapper

<div style="display: grid;  grid-template-columns: repeat(3, 1fr);">
    <h4>Offset of 0</h4>
    <h4>Offset of 1</h4>
    <h4>Offset of 10</h4>
    <div :id="wordsnapper_id_no_offset"></div>
    <div :id="wordsnapper_id_offset_1"></div>
    <div :id="wordsnapper_id_offset_10"></div>
</div>

### TextLineAdapter

<div style="display: grid;  grid-template-columns: repeat(3, 1fr);">
    <h4>Offset of 0</h4>
    <h4>Offset of 1</h4>
    <h4>Offset of 10</h4>
    <div :id="lines_id_no_offset"></div>
    <div :id="lines_id_offset_1"></div>
    <div :id="lines_id_offset_10"></div>
</div>

<script setup>
//
import { onMounted, ref } from "vue";
import { createDifferentTextOffset, createDifferentTextOffsetLines, createDifferentTextOffsetWordsnapper} from "@demo";
import { clearAnnotatedTextCache } from "@ghentcdh/annotated-text";
const id_offset_1 = `different-text-offset--1`;
const id_no_offset = `different-text-offset--0`;
const id_offset_10 = `different-text-offset--10`;

const wordsnapper_id_offset_1 = `different-text-offset-wordsnapper--1`;
const wordsnapper_id_no_offset = `different-text-offset-wordsnapper--0`;
const wordsnapper_id_offset_10 = `different-text-offset-wordsnapper--10`;


const lines_id_offset_1 = `different-text-offset-lines--1`;
const lines_id_no_offset = `different-text-offset-lines--0`;
const lines_id_offset_10 = `different-text-offset-lines--10`;


onMounted(()=> {
  clearAnnotatedTextCache();
    createDifferentTextOffset(id_offset_1,1);
    createDifferentTextOffset(id_no_offset,0);
    createDifferentTextOffset(id_offset_10,10);

    createDifferentTextOffsetWordsnapper(wordsnapper_id_offset_1,1);
    createDifferentTextOffsetWordsnapper(wordsnapper_id_no_offset,0);
    createDifferentTextOffsetWordsnapper(wordsnapper_id_offset_10,10);

    createDifferentTextOffsetLines(lines_id_offset_1,1);
    createDifferentTextOffsetLines(lines_id_no_offset,0);
    createDifferentTextOffsetLines(lines_id_offset_10,10);
});
</script>
