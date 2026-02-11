const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam aliquam blandit purus vitae porttitor. Etiam eu vestibulum est. Nullam consequat ac lorem in sodales. Donec vitae nisi efficitur, lobortis odio ac, viverra turpis. Curabitur malesuada felis urna, id facilisis magna placerat gravida. Donec tincidunt magna in felis rhoncus, id faucibus purus dignissim. Donec sagittis mollis accumsan. Aliquam tempus odio eget pretium semper. Etiam sit amet malesuada eros, quis volutpat nisi.
`;

const source = 'annotation-source://plain-text';
const w3cAnnotations = {
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  items: [
    {
      id: 'ann-1',
      motivation: 'tagging',
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      target: [
        {
          type: 'Text',
          selector: {
            start: 228,
            end: 488,
            type: 'TextPositionSelector',
          },
          textDirection: 'ltr',
          source,
        },
      ],
    },
    {
      id: 'ann-3',
      motivation: 'tagging',
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      body: [
        {
          type: 'TextualBody',
          value: 'example',
          purpose: 'tagging',
        },
      ],
      target: [
        {
          type: 'Text',
          selector: {
            start: 1,
            end: 20,
            type: 'TextPositionSelector',
          },
          textDirection: 'ltr',
          source: 'annotation-source://other-source',
        },
      ],
    },
  ],
  type: 'AnnotationPage',
};

export const w3cText = {
  text,
  w3cAnnotations,
  sourceId: source,
};
