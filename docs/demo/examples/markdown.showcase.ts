import { createAnnotatedText } from '@ghentcdh/annotated-text';
import { MarkdownTextAdapter } from '@ghentcdh/annotated-text--markdown';

export const markdownShowcase = `
# Markdown Showcase

A comprehensive reference of all common Markdown components.

---

## Table of Contents

- [Headings](#headings)
- [Text Formatting](#text-formatting)
- [Blockquotes](#blockquotes)
- [Lists](#lists)
- [Code](#code)
- [Tables](#tables)
- [Links & Images](#links--images)
- [Horizontal Rules](#horizontal-rules)
- [Task Lists](#task-lists)
- [Footnotes](#footnotes)
- [Emoji](#emoji)

---

## Headings

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## Text Formatting

Regular paragraph text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Line breaks can be forced  
by ending a line with two spaces.

**Bold text** using double asterisks  
__Bold text__ using double underscores

*Italic text* using single asterisk  
_Italic text_ using single underscore

***Bold and italic*** combined  
~~Strikethrough text~~  
\`Inline code\` using backticks  
==Highlighted text== (supported in some renderers)  
<u>Underlined text</u> via HTML  
<sub>Subscript</sub> and <sup>Superscript</sup>

---

## Blockquotes

> This is a simple blockquote.

> This is a multi-line blockquote.  
> It spans multiple lines.

> ### Blockquote with heading
> You can include other Markdown elements inside blockquotes.
>
>> Nested blockquote goes here.
>>
>>> Triple-nested blockquote.

---

## Lists

### Unordered List

- Item one
- Item two
  - Nested item A
  - Nested item B
    - Deeply nested item
- Item three

### Ordered List

1. First item
2. Second item
   1. Sub-item 2.1
   2. Sub-item 2.2
3. Third item

### Mixed List

1. Ordered top level
   - Unordered nested
   - Another nested item
2. Back to ordered

---

## Code

### Inline Code

Use \`console.log()\` to print to the console in JavaScript.

### Fenced Code Block (no language)

\`\`\`
This is a plain code block
with no syntax highlighting.
\`\`\`

### JavaScript

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
\`\`\`

### TypeScript

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

const getUser = async (id: number): Promise<User> => {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
};
\`\`\`

### Bash

\`\`\`bash
#!/bin/bash
echo "Hello, World!"
pnpm install && pnpm run build
\`\`\`

### JSON

\`\`\`json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  }
}
\`\`\`

### HTML

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Hello</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
\`\`\`

---

## Tables

### Basic Table

| Name       | Role              | Location   |
|------------|-------------------|------------|
| Alice      | Frontend Dev      | Berlin     |
| Bob        | Backend Dev       | Amsterdam  |
| Carol      | DevOps            | Ghent      |

### Aligned Columns

| Left aligned | Center aligned | Right aligned |
|:-------------|:--------------:|--------------:|
| Text         |     Text       |          Text |
| More text    |   More text    |     More text |
| \`code\`       |    **bold**    |        *italic* |

---

## Links & Images

### Links

[OpenAI](https://openai.com)  
[Anthropic](https://anthropic.com "Anthropic's website")  
<https://example.com> (auto-link)  
[Relative link](./another-file.md)

### Reference-style Links

[Ghent University][ghent]  
[Markdown Guide][md-guide]

[ghent]: https://www.ugent.be "Ghent University"
[md-guide]: https://www.markdownguide.org

---

## Horizontal Rules

Three or more hyphens:

---

Three or more asterisks:

***

Three or more underscores:

___

---

## Task Lists

- [x] Set up project structure
- [x] Configure TypeScript
- [ ] Write unit tests
- [ ] Deploy to production
  - [x] Configure Docker
  - [ ] Set up CI/CD pipeline

---

## Footnotes

Here is a sentence with a footnote.[^1]

Another sentence with a different footnote.[^note]

[^1]: This is the first footnote content.
[^note]: This is a named footnote with **formatted** content.

---

## Definition Lists

(Supported in extended Markdown / kramdown)

Term 1
: Definition for term 1.

Term 2
: First definition for term 2.
: Second definition for term 2.

---

## Emoji

:rocket: :tada: :white_check_mark: :warning: :bulb: :heart:

(Emoji shortcodes are supported on GitHub, Notion, and many other renderers.)

---

## HTML Embeds

Raw HTML is supported in most Markdown renderers:

<details>
  <summary>Click to expand</summary>

  Hidden content revealed on click. You can include **Markdown** inside here too.

</details>

<br>

<kbd>Ctrl</kbd> + <kbd>C</kbd> — keyboard key styling

---

## Escaping Special Characters

Use a backslash \`\\\` to escape Markdown syntax:

\\*Not italic\\*  
\\\`Not code\\\`  
\\# Not a heading  
\\[Not a link\\]

---

*End of Markdown Showcase*
`;

export const markdownShowcaseAnnotationsAnnotations = [
  { id: 'h1', start: 224, end: 233, label: 'Heading 1' },
  {
    id: 'h1.1',
    start: 225,
    end: 233,
    label: 'nes5ted',
    render: 'underline',
  },
  { id: '2', start: 234, end: 243, label: 'Heading 2' },
  { id: '3', start: 244, end: 253, label: 'Heading 3' },
  { id: '4', start: 254, end: 263, label: 'Heading 4' },
  { id: '5', start: 264, end: 273, label: 'Heading 5' },
  { id: '6', start: 274, end: 283, label: 'Heading 6' },
  {
    id: '7',
    start: 300,
    end: 783,
    label: 'Text formatting',
    render: 'underline',
  },
  { id: 'quote', start: 797, end: 825, label: 'Quote' },
  {
    id: 'quote-2',
    start: 900,
    end: 990,
    label: 'Quote somewhere in the middle',
  },
  {
    id: '63dbd9f2-f8ef-4f8f-aa49-94b5b7ce1053',
    start: 1865,
    end: 1877,
    label: 'json selector',
  },
  {
    id: '42e0a4b7-46dd-40ac-a4cf-29d5baa7a197',
    start: 2421,
    end: 2427,
    label: 'OpenAi link',
  },
  {
    id: 'eee4869d-e379-4a20-92e7-2431eabdf279',
    start: 2347,
    end: 2376,
    label: 'Table 3 cell selection',
  },
];

export const createMarkdownExample = (id: string) => {
  return createAnnotatedText(id)
    .setAnnotationAdapter({ create: true, edit: true })
    .setTextAdapter(MarkdownTextAdapter())
    .setText(markdownShowcase)
    .setRenderParams({
      defaultRenderer: 'highlight',
      renderFn: (annotation) => annotation.render,
    })
    .setTagLabelFn((a) => a.label)
    .setAnnotations(markdownShowcaseAnnotationsAnnotations);
};
