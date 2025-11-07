import { annotationColors } from "./const";

export const text = `**Markdown** 

Following markdown is supported:

- **Bold tekst**

- *Italic*

**Below is a markdown text**

Lorem ipsum *dolor* sit amet, **consectetur** adipiscing elit. Nullam aliquam blandit purus vitae porttitor. Etiam eu vestibulum est. Nullam consequat ac lorem in sodales. Donec vitae nisi efficitur, lobortis odio ac, viverra turpis. Curabitur malesuada felis urna, id facilisis magna placerat gravida. Donec tincidunt magna in felis rhoncus, id faucibus purus dignissim. Donec sagittis mollis accumsan. Aliquam tempus odio eget pretium semper. Etiam sit amet malesuada eros, quis volutpat nisi.
`;

const annotations = [
  {
    start: 0,
    end: 8,
    color: annotationColors["5"],
    id: "md-1",
  },
  {
    start: 64,
    end: 88,
    color: annotationColors["5"],
    id: "md-2",
  },
  {
    start: 57,
    end: 63,
    color: annotationColors["2"],
    id: "md-3",
  },
  {
    start: 101,
    end: 106,
    color: annotationColors["2"],
    id: "md-4",
  },
  {
    start: 117,
    end: 128,
    color: annotationColors["5"],
    id: "md-5",
  },
  {
    start: 89,
    end: 578,
    color: annotationColors["3"],
    id: "md-6",
  },
];

export const markdownText = {
  text,
  annotations: annotations,
};
