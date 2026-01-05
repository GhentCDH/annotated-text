// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  PlainTextAdapter,
  W3CAnnotationAdapter,
  type W3CAnnotation,
} from '@ghentcdh/annotated-text';

// Clear any cached instances
clearAnnotatedTextCache();

const SOURCE_URI = 'https://example.org/document/1';
const LANGUAGE = 'en';

// Sample text for all W3C tests
const sampleText = 'The quick brown fox jumps over the lazy dog. This is a sample text for testing W3C Web Annotations with TextPositionSelector.';

// Sample W3C annotations
const w3cAnnotations: W3CAnnotation[] = [
  {
    id: 'anno-1',
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    motivation: 'classifying',
    body: {
      type: 'TextualBody',
      format: 'text',
      value: 'Animal reference',
      language: 'en',
    },
    target: {
      type: 'Text',
      source: SOURCE_URI,
      selector: {
        type: 'TextPositionSelector',
        start: 16,
        end: 19, // "fox"
      },
    },
  },
  {
    id: 'anno-2',
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    motivation: 'classifying',
    body: {
      type: 'TextualBody',
      format: 'text',
      value: 'Action verb',
      language: 'en',
    },
    target: {
      type: 'Text',
      source: SOURCE_URI,
      selector: {
        type: 'TextPositionSelector',
        start: 20,
        end: 25, // "jumps"
      },
    },
  },
  {
    id: 'anno-3',
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    motivation: 'classifying',
    body: {
      type: 'TextualBody',
      format: 'text',
      value: 'Another animal',
      language: 'en',
    },
    target: {
      type: 'Text',
      source: SOURCE_URI,
      selector: {
        type: 'TextPositionSelector',
        start: 40,
        end: 43, // "dog"
      },
    },
  },
];

// Basic W3C annotations
const w3cBasic = createAnnotatedText('w3c-basic', {
  text: PlainTextAdapter({}),
  annotation: W3CAnnotationAdapter({
    sourceUri: SOURCE_URI,
    language: LANGUAGE,
  }),
});
w3cBasic
  .setText(sampleText)
  .setAnnotations(w3cAnnotations);

// W3C annotations with TextualBody
const w3cBodies = createAnnotatedText('w3c-bodies', {
  text: PlainTextAdapter({}),
  annotation: W3CAnnotationAdapter({
    sourceUri: SOURCE_URI,
    language: LANGUAGE,
  }),
});

const annotationsWithBodies: W3CAnnotation[] = [
  {
    id: 'body-anno-1',
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    motivation: 'classifying',
    body: [
      {
        type: 'TextualBody',
        format: 'text',
        value: 'Adjective describing speed',
        language: 'en',
      },
    ],
    target: {
      type: 'Text',
      source: SOURCE_URI,
      selector: {
        type: 'TextPositionSelector',
        start: 4,
        end: 9, // "quick"
      },
    },
  },
  {
    id: 'body-anno-2',
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    motivation: 'classifying',
    body: [
      {
        type: 'TextualBody',
        format: 'text',
        value: 'Color adjective',
        language: 'en',
      },
    ],
    target: {
      type: 'Text',
      source: SOURCE_URI,
      selector: {
        type: 'TextPositionSelector',
        start: 10,
        end: 15, // "brown"
      },
    },
  },
];

w3cBodies
  .setText(sampleText)
  .setAnnotations(annotationsWithBodies);

// W3C tagging annotations
const w3cTagging = createAnnotatedText('w3c-tagging', {
  text: PlainTextAdapter({}),
  annotation: W3CAnnotationAdapter({
    sourceUri: SOURCE_URI,
    language: LANGUAGE,
  }),
});

const taggingAnnotations: W3CAnnotation[] = [
  {
    id: 'tag-anno-1',
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    motivation: 'tagging',
    body: {
      type: 'TextualBody',
      purpose: 'tagging',
      value: 'noun',
    },
    target: {
      type: 'Text',
      source: SOURCE_URI,
      selector: {
        type: 'TextPositionSelector',
        start: 16,
        end: 19, // "fox"
      },
    },
  },
  {
    id: 'tag-anno-2',
    '@context': 'http://www.w3.org/ns/anno.jsonld',
    motivation: 'tagging',
    body: {
      type: 'TextualBody',
      purpose: 'tagging',
      value: 'adjective',
    },
    target: {
      type: 'Text',
      source: SOURCE_URI,
      selector: {
        type: 'TextPositionSelector',
        start: 35,
        end: 39, // "lazy"
      },
    },
  },
];

w3cTagging
  .setText(sampleText)
  .setAnnotations(taggingAnnotations);

// Interactive W3C annotations
const w3cInteractive = createAnnotatedText('w3c-interactive', {
  text: PlainTextAdapter({}),
  annotation: W3CAnnotationAdapter({
    sourceUri: SOURCE_URI,
    language: LANGUAGE,
  }),
  config: {
    annotation: {
      edit: true,
      create: true,
    },
  },
});

const eventLog = document.getElementById('event-log')!;
const annotationOutput = document.getElementById('annotation-output')!;

w3cInteractive
  .setText(sampleText)
  .setAnnotations([w3cAnnotations[0]])
  .on('all', (event) => {
    const logEntry = document.createElement('div');
    logEntry.textContent = `Event: ${event.event} - ${JSON.stringify(event.data?.id ?? event.data)}`;
    eventLog.appendChild(logEntry);

    // Keep only last 5 events
    while (eventLog.children.length > 5) {
      eventLog.removeChild(eventLog.firstChild!);
    }

    // If annotation was created or edited, show the W3C format
    if (event.event === 'annotation-create--end' || event.event === 'annotation-edit--end') {
      const annotation = event.data?.annotation;
      if (annotation) {
        // Format the annotation using the adapter
        const formatted = w3cInteractive.formatAnnotation(annotation);
        annotationOutput.textContent = JSON.stringify(formatted, null, 2);
      }
    }
  });

// Expose for test access
(window as any).__w3cTestInstances = {
  w3cBasic,
  w3cBodies,
  w3cTagging,
  w3cInteractive,
  sampleAnnotations: w3cAnnotations,
};
