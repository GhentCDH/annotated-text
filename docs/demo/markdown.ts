import { annotationColors } from "../../dev-app/const";
import { Annotation } from "../../src";

export const res = `**Markdown**

Following markdown is supported:

- **Bold tekst**

- *Italic*

**Below is a markdown text**

Lorem ipsum *dolor* sit amet, **consectetur** adipiscing elit. Nullam aliquam blandit purus vitae porttitor. Etiam eu vestibulum est. Nullam consequat ac lorem in sodales. Donec vitae nisi efficitur, lobortis odio ac, viverra turpis. Curabitur malesuada felis urna, id facilisis magna placerat gravida. Donec tincidunt magna in felis rhoncus, id faucibus purus dignissim. Donec sagittis mollis accumsan. Aliquam tempus odio eget pretium semper. Etiam sit amet malesuada eros, quis volutpat nisi.
`;
const text = `**Markdown**`;

const annotations = [
  {
    start: 2,
    end: 9,
    color: annotationColors["5"],
    id: "md-1",
  },
  {
    start: 80,
    end: 103,
    color: annotationColors["5"],
    id: "md-2",
  },
  {
    start: 69,
    end: 74,
    color: annotationColors["2"],
    id: "md-3",
  },
  {
    start: 121,
    end: 125,
    color: annotationColors["2"],
    id: "md-4",
  },
  {
    start: 140,
    end: 150,
    color: annotationColors["5"],
    id: "md-5",
  },
  {
    start: 108,
    end: 602,
    color: annotationColors["3"],
    id: "md-6",
  },
] as Annotation[];

export const markdownText = {
  text,
  annotations: annotations.slice(0, 1),
};
