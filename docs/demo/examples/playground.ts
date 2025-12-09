import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from "@ghentcdh/annotated-text";

const text = `1.The quick brown fox jumps over the lazy dog.\n2.Lorem ipsum dolor sit amet, consectetur adipiscing elit.`;

const annotations = [{ start: 12, end: 27, id: "fox-1" }];

export const setupPlayground = (id: string) => {
  clearAnnotatedTextCache();
  const firstAnnotation = annotations[0]!;

  const firstAnnotationOnly = document.createElement("div");
  firstAnnotationOnly.id = `${id}_${firstAnnotation.id}`;
  firstAnnotationOnly.innerHTML = "first Annotation Only";

  const fullText = document.createElement("div");
  fullText.id = `${id}_fulltext`;
  fullText.innerHTML = "Full Text with All Annotations";

  const mainElement = document.getElementById(id);

  mainElement.appendChild(firstAnnotationOnly);
  mainElement.appendChild(fullText);

  createAnnotatedText(firstAnnotationOnly.id, {
    text: TextLineAdapter({}),
  })
    .setText(text)
    .setAnnotations([firstAnnotation])
    .changeTextAdapterConfig("limit", {
      start: firstAnnotation.start,
      end: firstAnnotation.end,
    });

  createAnnotatedText(fullText.id, {
    text: TextLineAdapter({}),
  })
    .setText(text)
    .setAnnotations(annotations);
};
