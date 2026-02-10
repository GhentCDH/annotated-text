# Word Snapper

Ensures text annotations align to word boundaries for consistent and readable text selections.

This improves the consistency and readability of text highlights, preventing awkward partial word selections.

## Basic Usage

```typescript
import { WordSnapper } from '@ghentcdh/annotated-text';

// Create an annotated text with word snapping enabled
createAnnotatedText(id)
  .setSnapper(new WordSnapper())
  .setText(text)
  .setAnnotations(annotations);
```

## How It Works

The `WordSnapper` operates in two phases:

### 1. Initialization

When text is provided via `setText()`, the snapper:

- Tokenizes the text into words
- Records each token's start and end positions
- Builds boundary maps for efficient lookups

### 2. Snapping

When an annotation is created or modified, `fixOffset()`:

- Snaps the start position to the beginning of its containing word
- Snaps the end position to the end of its containing word
- Ensures the resulting range is valid (start < end)
- Returns the adjusted boundaries

## Custom tokenization

A custom tokenization function can be provided to the `WordSnapper` to handle specific text structures or languages.

```typescript
new WordSnapper((text: string): Token[] => {
  const lexer = new Tokenizr();

  //ignore word boundries
  lexer.rule(/†/, (ctx: { accept: (arg0: string) => void }) => {
    //ctx.accept("start char")
    ctx.accept("start");
  })
})
```

# Example

<div>
    <div id="annotated--word-snapper"></div>
</div>

<script setup>
//
import { onMounted } from "vue";
 
import { clearAnnotatedTextCache} from "@ghentcdh/annotated-text";
import { wordSnapper } from "@demo";

onMounted(()=> {
    clearAnnotatedTextCache();
    wordSnapper('annotated--word-snapper')
});

</script>
