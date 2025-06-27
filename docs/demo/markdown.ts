import { annotationColors } from "../../dev-app/const";
import { Annotation } from "../../src";

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
    end: 7,
    color: annotationColors["5"],
    id: "md-1",
  },
  {
    start: 64,
    end: 87,
    color: annotationColors["5"],
    id: "md-2",
  },
  {
    start: 57,
    end: 62,
    color: annotationColors["2"],
    id: "md-3",
  },
  {
    start: 101,
    end: 105,
    color: annotationColors["2"],
    id: "md-4",
  },
  {
    start: 117,
    end: 127,
    color: annotationColors["5"],
    id: "md-5",
  },
  {
    start: 89,
    end: 577,
    color: annotationColors["3"],
    id: "md-6",
  },
] as Annotation[];

export const markdownText = {
  text,
  annotations: annotations,
};
