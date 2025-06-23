import { annotationColors } from "../../dev-app/const";
import { Annotation } from "../../src";

export const text = `**Markdown**

Following markdown is supported:

- **Bold tekst**

- *Italic*

**Below is a markdown text**


Lorem ipsum *dolor* sit amet, **consectetur** adipiscing elit. Nullam aliquam blandit purus vitae porttitor. Etiam eu vestibulum est. Nullam consequat ac lorem in sodales. Donec vitae nisi efficitur, lobortis odio ac, viverra turpis. Curabitur malesuada felis urna, id facilisis magna placerat gravida. Donec tincidunt magna in felis rhoncus, id faucibus purus dignissim. Donec sagittis mollis accumsan. Aliquam tempus odio eget pretium semper. Etiam sit amet malesuada eros, quis volutpat nisi.

Duis pharetra vitae nisl nec mattis. Proin scelerisque feugiat mollis. Ut vel nisi pretium, varius enim a, tempor leo. Vestibulum pulvinar, justo eget bibendum mollis, ligula nisi tristique est, consequat luctus ipsum augue sit amet lectus. Donec ut malesuada orci. In non mollis mi. Donec sit amet velit et erat pharetra dignissim. Nam ultricies porttitor ipsum, sit amet molestie justo lacinia tincidunt. Aenean vitae interdum mi. Nunc eu ipsum non neque mattis tempor vitae id nisi. Pellentesque vel facilisis felis, sed auctor dui. Nunc facilisis tristique tellus, at rutrum sem interdum vel. Sed cursus lectus lorem, non tempus sem aliquam ut. Suspendisse velit massa, posuere id mauris sit amet, porta laoreet est. Suspendisse vitae bibendum turpis. Sed commodo, augue sit amet euismod aliquet, ligula lacus efficitur elit, et tempus diam mi non dolor.

Mauris rhoncus odio ipsum, in lacinia nisl feugiat id. Aliquam eu sollicitudin lorem, ac porta dolor. Integer eleifend et metus eu bibendum. Praesent fringilla luctus blandit. Sed sit amet faucibus velit, et laoreet nisl. Nunc rutrum viverra leo, a viverra nisi vehicula hendrerit. Phasellus sodales a elit sed tincidunt. Cras nec ligula auctor massa auctor viverra. Pellentesque imperdiet, lacus quis efficitur venenatis, enim sem ultrices nulla, at ornare turpis erat ut tortor. Phasellus finibus nisl ut rhoncus suscipit. Vivamus finibus suscipit lorem. Donec egestas purus nec tincidunt mattis. Sed molestie elementum hendrerit.
`;

const annotations = [
  {
    start: 2,
    end: 9,
    color: annotationColors["5"],
    id: "md-1",
  },
  {
    start: 76,
    end: 99,
    color: annotationColors["5"],
    id: "md-2",
  },
  {
    start: 65,
    end: 70,
    color: annotationColors["2"],
    id: "md-3",
  },
  {
    start: 117,
    end: 121,
    color: annotationColors["2"],
    id: "md-4",
  },
  {
    start: 136,
    end: 146,
    color: annotationColors["5"],
    id: "md-5",
  },
  {
    start: 104,
    end: 598,
    color: annotationColors["3"],
    id: "md-6",
  },
] as Annotation[];

export const markdownText = {
  text,
  annotations: annotations.slice(0, 1),
};
