export const MarkdownLimit = {
  limitIgnoreLines: {
    type: 'TextPositionSelector',
    start: 15,
    end: 89,
    ignoreLines: true,
  },
  limit: {
    type: 'TextPositionSelector',
    start: 15,
    end: 89,
    ignoreLines: false,
  },
  text: `
  Feathers & Fur  

An unlikely **friendship** bloomed between a colorful *parrot* and a gentle *dog*. One spoke in squawks and mimicked laughter, the other communicated through tail wags and soft brown eyes. Yet somehow, without sharing a common language, they understood each other perfectly.  

Every morning they claimed the same sunny spot on the couch, the parrot perched boldly on the dog's broad back. The dog never minded. He simply sighed contentedly, as if carrying his feathered companion was the most natural thing in the world.  

Their bond reminded everyone nearby that friendship needs no explanation — only warmth, presence, and a willingness to share the light.

`,
  annotations: [
    {
      '@context': [
        'http://www.w3.org/ns/anno.jsonld',
        'http://localhost:3000/ns/AnnotationStyle.jsonld',
        'http://localhost:3000/ns/phrase.jsonld',
      ],
      id: 'mela:annotation/53522173-f401-40a1-91d1-2c59258aa93c',
      type: 'Annotation',
      body: [
        {
          id: 'phrase',
          type: 'AnnotationStyle',
          purpose: 'styling',
          name: 'Phrase',
          target: 'underline',
          color: '#9d1bd8',
        },
      ],
      target: [
        {
          type: 'SpecificResource',
          source: 'mela:section_text/33a3616b-9fc4-4625-872d-bb7158c69c11',
          selector: [
            {
              type: 'TextPositionSelector',
              start: 15,
              end: 89,
            },
            {
              type: 'TextQuoteSelector',
              exact:
                'An unlikely friendship bloomed between a colorful parrot and a gentle dog.',
              prefix: 'Feathers & Fur',
              suffix: ' One spoke in squawks and mimicked laughter,',
            },
          ],
        },
        {
          type: 'SpecificResource',
          source: 'mela:annotation/d51a55d7-bf20-4236-a470-51647e0ff026',
          selector: {
            type: 'TextPositionSelector',
            start: 0,
            end: 263,
          },
        },
        {
          source: 'mela:annotation/d51a55d7-bf20-4236-a470-51647e0ff026',
        },
      ],
      motivation: 'tagging',
      creator: {
        type: 'Software',
        name: 'Ugent - Mela',
      },
      created: '2026-04-21T13:34:22.794Z',
      modified: '2026-04-22T13:18:59.150Z',
    },
  ],
};
