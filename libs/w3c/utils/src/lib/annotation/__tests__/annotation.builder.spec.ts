import { describe, expect, it, vi } from 'vitest';
import { w3cAnnotation, W3CAnnotationBuilder } from '../annotation.builder';
import {
  isW3CTextualBody,
  isW3CCustomBody,
  getTextualBodies,
  getCustomBodies,
  getBodies,
} from '../annotation-helpers';
import type {
  W3CAnnotation,
  W3CBody,
  W3CSpecificResource,
  W3CTextualBody,
} from '../annotation.schema';
import { W3CTextualBody as W3CTextualBodySchema } from '../annotation.schema';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const SOURCE_URI = 'https://example.org/doc/1';
const SOURCE_URI_2 = 'https://example.org/doc/2';

const minimalAnnotation: W3CAnnotation = {
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  type: 'Annotation',
  id: 'https://example.org/anno/1',
  target: SOURCE_URI,
};

const specificResourceTarget: W3CSpecificResource = {
  type: 'SpecificResource',
  source: SOURCE_URI,
  selector: {
    type: 'TextQuoteSelector',
    exact: 'Hello world',
    prefix: 'Say ',
    suffix: '!',
  },
};

const annotationWithSpecificResource: W3CAnnotation = {
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  type: 'Annotation',
  id: 'https://example.org/anno/2',
  target: specificResourceTarget,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('W3CAnnotationBuilder', () => {
  describe('constructor', () => {
    it('should create a new annotation with default context and type', () => {
      const state = w3cAnnotation().peek();
      expect(state['@context']).toBe('http://www.w3.org/ns/anno.jsonld');
      expect(state.type).toBe('Annotation');
    });

    it('should deep-clone an existing annotation', () => {
      const builder = w3cAnnotation(minimalAnnotation);
      builder.setId('https://example.org/anno/changed');

      expect(minimalAnnotation.id).toBe('https://example.org/anno/1');
      expect(builder.peek().id).toBe('https://example.org/anno/changed');
    });
  });

  describe('clone', () => {
    it('should return a new builder with the same state', () => {
      const original = w3cAnnotation()
        .setId('https://example.org/anno/1')
        .setMotivation('oa:commenting')
        .setTarget('https://example.org/doc');

      const clone = original.clone();
      expect(clone).not.toBe(original);
      expect(clone.peek()).toEqual(original.peek());
    });

    it('should not be affected by changes to the original', () => {
      const original = w3cAnnotation()
        .setId('https://example.org/anno/1')
        .setTarget('https://example.org/doc');

      const clone = original.clone();
      original.setId('https://example.org/anno/changed');

      expect(clone.peek().id).toBe('https://example.org/anno/1');
    });
  });

  describe('identity', () => {
    it('should set the id', () => {
      const state = w3cAnnotation().setId('https://example.org/anno/1').peek();
      expect(state.id).toBe('https://example.org/anno/1');
    });

    it('should set a custom context', () => {
      const ctx = ['http://www.w3.org/ns/anno.jsonld', 'http://custom.org/ns'];
      const state = w3cAnnotation().setContext(ctx).peek();
      expect(state['@context']).toEqual(ctx);
    });
  });

  describe('motivation', () => {
    it('should set a single motivation', () => {
      const state = w3cAnnotation().setMotivation('oa:commenting').peek();
      expect(state.motivation).toBe('oa:commenting');
    });

    it('should set multiple motivations', () => {
      const state = w3cAnnotation()
        .setMotivation(['oa:commenting', 'oa:tagging'])
        .peek();
      expect(state.motivation).toEqual(['oa:commenting', 'oa:tagging']);
    });

    it('should add a motivation', () => {
      const state = w3cAnnotation()
        .setMotivation('oa:commenting')
        .addMotivation('oa:tagging')
        .peek();
      expect(state.motivation).toEqual(['oa:commenting', 'oa:tagging']);
    });

    it('should deduplicate when adding a motivation that already exists', () => {
      const state = w3cAnnotation()
        .setMotivation('oa:commenting')
        .addMotivation('oa:commenting')
        .peek();
      expect(state.motivation).toBe('oa:commenting');
    });

    it('should add motivation when none exists yet', () => {
      const state = w3cAnnotation().addMotivation('oa:commenting').peek();
      expect(state.motivation).toBe('oa:commenting');
    });

    it('should remove a motivation', () => {
      const state = w3cAnnotation()
        .setMotivation(['oa:commenting', 'oa:tagging'])
        .removeMotivation('oa:tagging')
        .peek();
      expect(state.motivation).toBe('oa:commenting');
    });

    it('should set motivation to undefined when removing the last one', () => {
      const state = w3cAnnotation()
        .setMotivation('oa:commenting')
        .removeMotivation('oa:commenting')
        .peek();
      expect(state.motivation).toBeUndefined();
    });
  });

  describe('target', () => {
    it('should set a single IRI target', () => {
      const state = w3cAnnotation().setTarget(SOURCE_URI).peek();
      expect(state.target).toBe(SOURCE_URI);
    });

    it('should set multiple targets', () => {
      const state = w3cAnnotation()
        .setTarget([SOURCE_URI, SOURCE_URI_2])
        .peek();
      expect(state.target).toEqual([SOURCE_URI, SOURCE_URI_2]);
    });

    it('should add a target', () => {
      const state = w3cAnnotation()
        .setTarget(SOURCE_URI)
        .addTarget(SOURCE_URI_2)
        .peek();
      expect(state.target).toEqual([SOURCE_URI, SOURCE_URI_2]);
    });

    it('should replace a target by source URI', () => {
      const newTarget: W3CSpecificResource = {
        type: 'SpecificResource',
        source: SOURCE_URI,
        selector: { type: 'TextQuoteSelector', exact: 'replaced' },
      };
      const state = w3cAnnotation()
        .setTarget([SOURCE_URI, SOURCE_URI_2])
        .replaceTarget(SOURCE_URI, newTarget)
        .peek();
      expect(state.target).toEqual([newTarget, SOURCE_URI_2]);
    });

    it('should replace a SpecificResource target by source URI', () => {
      const replacement: W3CSpecificResource = {
        type: 'SpecificResource',
        source: SOURCE_URI,
        selector: { type: 'TextQuoteSelector', exact: 'new' },
      };
      const state = w3cAnnotation(annotationWithSpecificResource)
        .replaceTarget(SOURCE_URI, replacement)
        .peek();
      expect(state.target).toEqual(replacement);
    });

    it('should remove a target by source URI (string)', () => {
      const state = w3cAnnotation()
        .setTarget([SOURCE_URI, SOURCE_URI_2])
        .removeTarget(SOURCE_URI)
        .peek();
      expect(state.target).toBe(SOURCE_URI_2);
    });

    it('should remove a target by source URI (SpecificResource)', () => {
      const state = w3cAnnotation()
        .setTarget([specificResourceTarget, SOURCE_URI_2])
        .removeTarget(SOURCE_URI)
        .peek();
      expect(state.target).toBe(SOURCE_URI_2);
    });
  });

  describe('selector helpers', () => {
    describe('updateTextQuoteSelector', () => {
      it('should add a TextQuoteSelector to an existing SpecificResource target', () => {
        const builder = w3cAnnotation()
          .setTarget(specificResourceTarget)
          .updateTextQuoteSelector({ exact: 'updated text', prefix: 'pre' });

        const selectors = builder.getTextQuoteSelector();
        expect(selectors).toHaveLength(1);
        expect(selectors[0]).toEqual({
          type: 'TextQuoteSelector',
          exact: 'updated text',
          prefix: 'pre',
        });
      });

      it('should create a new SpecificResource when sourceUri is provided and not found', () => {
        const builder = w3cAnnotation()
          .setTarget(SOURCE_URI)
          .updateTextQuoteSelector({ exact: 'text' }, SOURCE_URI_2);

        const selectors = builder.getTextQuoteSelector(SOURCE_URI_2);
        expect(selectors).toHaveLength(1);
        expect(selectors[0].exact).toBe('text');
      });

      it('should throw when no SpecificResource target and no sourceUri', () => {
        const builder = w3cAnnotation().setTarget(SOURCE_URI);

        expect(() =>
          builder.updateTextQuoteSelector({ exact: 'text' }),
        ).toThrow('No SpecificResource target found');
      });
    });

    describe('updateTextPositionSelector', () => {
      it('should upsert a TextPositionSelector', () => {
        const builder = w3cAnnotation()
          .setTarget(specificResourceTarget)
          .updateTextPositionSelector({ start: 10, end: 20 });

        const selectors = builder.getTextPositionSelector();
        expect(selectors).toHaveLength(1);
        expect(selectors[0]).toEqual({
          type: 'TextPositionSelector',
          start: 10,
          end: 20,
        });
      });
    });

    describe('updateFragmentSelector', () => {
      it('should upsert a FragmentSelector', () => {
        const builder = w3cAnnotation()
          .setTarget(specificResourceTarget)
          .updateFragmentSelector({ value: 'xywh=100,100,200,200' });

        const selectors = builder.getFragmentSelector();
        expect(selectors).toHaveLength(1);
        expect(selectors[0]).toEqual({
          type: 'FragmentSelector',
          value: 'xywh=100,100,200,200',
        });
      });
    });

    describe('updateSvgSelector', () => {
      it('should upsert an SvgSelector', () => {
        const builder = w3cAnnotation()
          .setTarget(specificResourceTarget)
          .updateSvgSelector({ value: '<svg>...</svg>' });

        const state = builder.peek();
        const target = state.target as W3CSpecificResource;
        const selectors = Array.isArray(target.selector)
          ? target.selector
          : [target.selector];
        const svgSelector = selectors.find(
          (s: any) => s?.type === 'SvgSelector',
        );
        expect(svgSelector).toEqual({
          type: 'SvgSelector',
          value: '<svg>...</svg>',
        });
      });
    });

    describe('removeTextQuoteSelector', () => {
      it('should remove a TextQuoteSelector', () => {
        const builder = w3cAnnotation()
          .setTarget(specificResourceTarget)
          .removeTextQuoteSelector();

        const selectors = builder.getTextQuoteSelector();
        expect(selectors).toHaveLength(0);
      });
    });

    describe('removeTextPositionSelector', () => {
      it('should remove a TextPositionSelector', () => {
        const builder = w3cAnnotation()
          .setTarget(specificResourceTarget)
          .updateTextPositionSelector({ start: 0, end: 5 })
          .removeTextPositionSelector();

        const selectors = builder.getTextPositionSelector();
        expect(selectors).toHaveLength(0);
      });
    });

    describe('removeFragmentSelector', () => {
      it('should remove a FragmentSelector', () => {
        const builder = w3cAnnotation()
          .setTarget(specificResourceTarget)
          .updateFragmentSelector({ value: 'xywh=0,0,10,10' })
          .removeFragmentSelector();

        const selectors = builder.getFragmentSelector();
        expect(selectors).toHaveLength(0);
      });
    });

    it('should scope selector operations to a specific sourceUri', () => {
      const target2: W3CSpecificResource = {
        type: 'SpecificResource',
        source: SOURCE_URI_2,
      };
      const builder = w3cAnnotation()
        .setTarget([specificResourceTarget, target2])
        .updateTextQuoteSelector({ exact: 'target2 text' }, SOURCE_URI_2);

      expect(builder.getTextQuoteSelector(SOURCE_URI)).toHaveLength(1);
      expect(builder.getTextQuoteSelector(SOURCE_URI)[0].exact).toBe(
        'Hello world',
      );
      expect(builder.getTextQuoteSelector(SOURCE_URI_2)).toHaveLength(1);
      expect(builder.getTextQuoteSelector(SOURCE_URI_2)[0].exact).toBe(
        'target2 text',
      );
    });
  });

  describe('body', () => {
    it('should set a body', () => {
      const body: W3CTextualBody = {
        type: 'TextualBody',
        value: 'A comment',
      };
      const state = w3cAnnotation().setBody(body).peek();
      expect(state.body).toEqual(body);
    });

    it('should add a body', () => {
      const body1: W3CTextualBody = {
        type: 'TextualBody',
        value: 'First',
      };
      const body2: W3CTextualBody = {
        type: 'TextualBody',
        value: 'Second',
      };
      const state = w3cAnnotation().setBody(body1).addBody(body2).peek();
      expect(state.body).toEqual([body1, body2]);
    });

    describe('updateTextualBody', () => {
      it('should add a TextualBody when none exists', () => {
        const state = w3cAnnotation()
          .updateTextualBody('My comment', 'oa:commenting')
          .peek();
        expect(state.body).toEqual({
          type: 'TextualBody',
          value: 'My comment',
          purpose: 'oa:commenting',
        });
      });

      it('should replace a TextualBody with the same purpose', () => {
        const state = w3cAnnotation()
          .updateTextualBody('Old comment', 'oa:commenting')
          .updateTextualBody('New comment', 'oa:commenting')
          .peek();
        expect(state.body).toEqual({
          type: 'TextualBody',
          value: 'New comment',
          purpose: 'oa:commenting',
        });
      });

      it('should add a TextualBody with a different purpose', () => {
        const state = w3cAnnotation()
          .updateTextualBody('Comment', 'oa:commenting')
          .updateTextualBody('Tag', 'oa:tagging')
          .peek();
        expect(state.body).toEqual([
          { type: 'TextualBody', value: 'Comment', purpose: 'oa:commenting' },
          { type: 'TextualBody', value: 'Tag', purpose: 'oa:tagging' },
        ]);
      });

      it('should replace the first TextualBody when no purpose is given', () => {
        const state = w3cAnnotation()
          .updateTextualBody('First')
          .updateTextualBody('Replaced')
          .peek();
        expect(state.body).toEqual({
          type: 'TextualBody',
          value: 'Replaced',
        });
      });

      it('should apply extras to the TextualBody', () => {
        const state = w3cAnnotation()
          .updateTextualBody('Comment', 'oa:commenting', {
            language: 'en',
            format: 'text/plain',
          })
          .peek();
        const body = state.body as W3CTextualBody;
        expect(body.language).toBe('en');
        expect(body.format).toBe('text/plain');
      });
    });

    describe('removeTextualBody', () => {
      it('should remove all TextualBodies when no purpose is given', () => {
        const state = w3cAnnotation()
          .updateTextualBody('A', 'oa:commenting')
          .updateTextualBody('B', 'oa:tagging')
          .removeTextualBody()
          .peek();
        expect(state.body).toBeUndefined();
      });

      it('should remove only TextualBodies with a matching purpose', () => {
        const state = w3cAnnotation()
          .updateTextualBody('Comment', 'oa:commenting')
          .updateTextualBody('Tag', 'oa:tagging')
          .removeTextualBody('oa:commenting')
          .peek();
        expect(state.body).toEqual({
          type: 'TextualBody',
          value: 'Tag',
          purpose: 'oa:tagging',
        });
      });
    });

    describe('updateBodyByType', () => {
      it('should add a body when no matching type exists', () => {
        const state = w3cAnnotation()
          .updateBodyByType('AnnotationStyle', {
            type: 'AnnotationStyle',
            id: 'paragraph',
            name: 'Paragraph',
          })
          .peek();

        expect(state.body).toStrictEqual({
          type: 'AnnotationStyle',
          id: 'paragraph',
          name: 'Paragraph',
        });
      });

      it('should replace a body with the same type', () => {
        const state = w3cAnnotation()
          .updateBodyByType('AnnotationStyle', {
            type: 'AnnotationStyle',
            id: 'paragraph',
            name: 'Paragraph',
          })
          .updateBodyByType('AnnotationStyle', {
            type: 'AnnotationStyle',
            id: 'heading',
            name: 'Heading',
          })
          .peek();

        expect(state.body).toStrictEqual({
          type: 'AnnotationStyle',
          id: 'heading',
          name: 'Heading',
        });
      });

      it('should not replace bodies of a different type', () => {
        const state = w3cAnnotation()
          .updateTextualBody('hello', 'oa:commenting')
          .updateBodyByType('AnnotationStyle', {
            type: 'AnnotationStyle',
            id: 'paragraph',
          })
          .peek();

        const bodies = state.body as W3CBody[];
        expect(bodies).toHaveLength(2);
        expect((bodies[0] as W3CTextualBody).value).toBe('hello');
        expect((bodies[1] as any).type).toBe('AnnotationStyle');
      });

      it('should match when type is an array', () => {
        const state = w3cAnnotation()
          .setBody({
            type: ['AnnotationStyle', 'CustomType'],
            id: 'old',
          } as any)
          .updateBodyByType('AnnotationStyle', {
            type: 'AnnotationStyle',
            id: 'new',
          })
          .peek();

        expect(state.body).toStrictEqual({
          type: 'AnnotationStyle',
          id: 'new',
        });
      });
    });
  });

  describe('TextualBody with extended type array', () => {
    it('should validate a TextualBody with type as an array including custom IRI', () => {
      const body = {
        type: ['TextualBody', 'https://my-app.example.org/types/type-1'],
        format: 'application/json',
        value:
          '{"register":{"id":"mela:register:7979e83f","label":"test"}}',
      };
      const result = W3CTextualBodySchema.safeParse(body);
      expect(result.success).toBe(true);
    });

    it('should validate a TextualBody with @context and prefixed type', () => {
      const body = {
        '@context': [
          'http://www.w3.org/ns/anno.jsonld',
          { myapp: 'https://my-app.example.org/types/' },
        ],
        type: ['TextualBody', 'myapp:type-1'],
        format: 'application/json',
        value:
          '{"register":{"id":"mela:register:7979e83f","label":"test"}}',
      };
      const result = W3CTextualBodySchema.safeParse(body);
      expect(result.success).toBe(true);
    });

    it('should reject a type array that does not include "TextualBody"', () => {
      const body = {
        type: ['https://my-app.example.org/types/type-1'],
        value: 'some value',
      };
      const result = W3CTextualBodySchema.safeParse(body);
      expect(result.success).toBe(false);
    });

    it('should recognise extended TextualBody via isW3CTextualBody guard', () => {
      const body: W3CBody = {
        type: ['TextualBody', 'https://my-app.example.org/types/type-1'],
        format: 'application/json',
        value:
          '{"register":{"id":"mela:register:7979e83f","label":"test"}}',
      };
      expect(isW3CTextualBody(body)).toBe(true);
    });

    it('should set an extended TextualBody via the builder', () => {
      const body: W3CTextualBody = {
        type: ['TextualBody', 'https://my-app.example.org/types/type-1'],
        format: 'application/json',
        value:
          '{"register":{"id":"mela:register:7979e83f","label":"test"}}',
      };
      const state = w3cAnnotation().setBody(body).peek();
      expect(state.body).toEqual(body);
    });

    it('should retrieve extended TextualBodies via getTextualBodies', () => {
      const body: W3CTextualBody = {
        type: ['TextualBody', 'https://my-app.example.org/types/type-1'],
        format: 'application/json',
        value: '{"key":"value"}',
        purpose: 'oa:classifying',
      };
      const ann: W3CAnnotation = {
        '@context': 'http://www.w3.org/ns/anno.jsonld',
        type: 'Annotation',
        id: 'https://example.org/anno/1',
        target: SOURCE_URI,
        body,
      };
      const bodies = getTextualBodies('oa:classifying')(ann);
      expect(bodies).toHaveLength(1);
      expect(bodies[0].value).toBe('{"key":"value"}');
    });

    it('should build a valid annotation with extended TextualBody', () => {
      const body: W3CTextualBody = {
        '@context': [
          'http://www.w3.org/ns/anno.jsonld',
          { myapp: 'https://my-app.example.org/types/' },
        ],
        type: ['TextualBody', 'myapp:type-1'],
        format: 'application/json',
        value: '{"key":"value"}',
      };
      const annotation = w3cAnnotation()
        .setId('https://example.org/anno/1')
        .setTarget(SOURCE_URI)
        .setBody(body)
        .build();

      expect(annotation.body).toEqual(body);
    });
  });

  describe('custom body (W3CCustomBody)', () => {
    const customBody = {
      definition: 'uri:my-app/type-1',
      format: 'application/json',
      value:
        '{"register":{"id":"mela:register:7979e83f","label":"test"}}',
    };

    it('should recognise a custom body via isW3CCustomBody guard', () => {
      expect(isW3CCustomBody(customBody as W3CBody)).toBe(true);
    });

    it('should not recognise a TextualBody as custom', () => {
      const textual: W3CBody = {
        type: 'TextualBody',
        value: 'hello',
      };
      expect(isW3CCustomBody(textual)).toBe(false);
    });

    it('should set a custom body via the builder', () => {
      const state = w3cAnnotation().setBody(customBody as W3CBody).peek();
      expect(state.body).toEqual(customBody);
    });

    it('should retrieve custom bodies via getCustomBodies', () => {
      const ann: W3CAnnotation = {
        '@context': 'http://www.w3.org/ns/anno.jsonld',
        type: 'Annotation',
        id: 'https://example.org/anno/1',
        target: SOURCE_URI,
        body: [
          { type: 'TextualBody', value: 'a comment' },
          customBody as W3CBody,
        ],
      };
      const customs = getCustomBodies()(ann);
      expect(customs).toHaveLength(1);
      expect(customs[0]).toEqual(customBody);
    });

    it('should build a valid annotation with a custom body', () => {
      const annotation = w3cAnnotation()
        .setId('https://example.org/anno/1')
        .setTarget(SOURCE_URI)
        .setBody(customBody as W3CBody)
        .build();

      expect(annotation.body).toEqual(customBody);
    });
  });

  describe('purpose', () => {
    it('should update purpose on all TextualBodies', () => {
      const state = w3cAnnotation()
        .updateTextualBody('Comment', 'oa:commenting')
        .updatePurpose('oa:tagging')
        .peek();
      const body = state.body as W3CTextualBody;
      expect(body.purpose).toBe('oa:tagging');
    });

    it('should only update bodies with a matching current purpose', () => {
      const state = w3cAnnotation()
        .updateTextualBody('Comment', 'oa:commenting')
        .updateTextualBody('Tag', 'oa:tagging')
        .updatePurpose('oa:describing', 'oa:commenting')
        .peek();
      const bodies = state.body as W3CTextualBody[];
      expect(bodies[0].purpose).toBe('oa:describing');
      expect(bodies[1].purpose).toBe('oa:tagging');
    });
  });

  describe('provenance', () => {
    it('should set creator', () => {
      const creator = { type: 'Person' as const, name: 'Alice' };
      const state = w3cAnnotation().setCreator(creator).peek();
      expect(state.creator).toEqual(creator);
    });

    it('should set generator', () => {
      const generator = { type: 'Software' as const, name: 'TestApp' };
      const state = w3cAnnotation().setGenerator(generator).peek();
      expect(state.generator).toEqual(generator);
    });

    it('should set created with a string', () => {
      const state = w3cAnnotation().setCreated('2024-01-01T00:00:00Z').peek();
      expect(state.created).toBe('2024-01-01T00:00:00Z');
    });

    it('should set created with a Date', () => {
      const date = new Date('2024-06-15T12:00:00Z');
      const state = w3cAnnotation().setCreated(date).peek();
      expect(state.created).toBe(date.toISOString());
    });

    it('should set modified', () => {
      const state = w3cAnnotation().setModified('2024-01-01T00:00:00Z').peek();
      expect(state.modified).toBe('2024-01-01T00:00:00Z');
    });

    it('should stamp modified via touch()', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'));

      const state = w3cAnnotation().touch().peek();
      expect(state.modified).toBe('2024-03-15T10:00:00.000Z');

      vi.useRealTimers();
    });
  });

  describe('styling', () => {
    it('should set a stylesheet string', () => {
      const state = w3cAnnotation()
        .setStylesheet('https://example.org/style.css')
        .peek();
      expect(state.stylesheet).toBe('https://example.org/style.css');
    });

    it('should set a CssStylesheet object', () => {
      const stylesheet = {
        type: 'CssStylesheet' as const,
        value: '.highlight { color: red; }',
      };
      const state = w3cAnnotation().setStylesheet(stylesheet).peek();
      expect(state.stylesheet).toEqual(stylesheet);
    });
  });

  describe('read / inspect', () => {
    describe('getBodiesByType', () => {
      it('should return bodies matching a type string', () => {
        const builder = w3cAnnotation()
          .setBody([
            { type: 'TextualBody', value: 'hello' },
            { type: 'SpecificResource', source: 'https://example.org' },
          ]);
        const results = builder.getBodiesByType('TextualBody');
        expect(results).toHaveLength(1);
        expect((results[0] as any).value).toBe('hello');
      });

      it('should match when type is an array', () => {
        const builder = w3cAnnotation()
          .setBody({
            type: ['TextualBody', 'https://example.org/types/custom'],
            value: 'hello',
          } as any);
        expect(builder.getBodiesByType('TextualBody')).toHaveLength(1);
        expect(
          builder.getBodiesByType('https://example.org/types/custom'),
        ).toHaveLength(1);
      });

      it('should return empty array when no bodies match', () => {
        const builder = w3cAnnotation()
          .setBody({ type: 'TextualBody', value: 'hello' });
        expect(builder.getBodiesByType('SpecificResource')).toHaveLength(0);
      });

      it('should skip IRI string bodies', () => {
        const builder = w3cAnnotation()
          .setBody('https://example.org/body' as any);
        expect(builder.getBodiesByType('TextualBody')).toHaveLength(0);
      });
    });

    describe('getTextQuoteSelector', () => {
      it('should return all TextQuoteSelectors', () => {
        const builder = w3cAnnotation(annotationWithSpecificResource);
        const selectors = builder.getTextQuoteSelector();
        expect(selectors).toHaveLength(1);
        expect(selectors[0].exact).toBe('Hello world');
      });

      it('should return TextQuoteSelectors scoped to a source URI', () => {
        const builder = w3cAnnotation(annotationWithSpecificResource);
        expect(builder.getTextQuoteSelector(SOURCE_URI)).toHaveLength(1);
        expect(builder.getTextQuoteSelector(SOURCE_URI_2)).toHaveLength(0);
      });
    });

    describe('getTextPositionSelector', () => {
      it('should return all TextPositionSelectors', () => {
        const ann: W3CAnnotation = {
          ...minimalAnnotation,
          target: {
            type: 'SpecificResource',
            source: SOURCE_URI,
            selector: { type: 'TextPositionSelector', start: 0, end: 10 },
          },
        };
        const selectors = w3cAnnotation(ann).getTextPositionSelector();
        expect(selectors).toHaveLength(1);
        expect(selectors[0]).toEqual({
          type: 'TextPositionSelector',
          start: 0,
          end: 10,
        });
      });

      it('should return TextPositionSelectors scoped to a source URI', () => {
        const ann: W3CAnnotation = {
          ...minimalAnnotation,
          target: {
            type: 'SpecificResource',
            source: SOURCE_URI,
            selector: { type: 'TextPositionSelector', start: 0, end: 10 },
          },
        };
        expect(
          w3cAnnotation(ann).getTextPositionSelector(SOURCE_URI),
        ).toHaveLength(1);
        expect(
          w3cAnnotation(ann).getTextPositionSelector(SOURCE_URI_2),
        ).toHaveLength(0);
      });
    });

    describe('getFragmentSelector', () => {
      it('should return all FragmentSelectors', () => {
        const ann: W3CAnnotation = {
          ...minimalAnnotation,
          target: {
            type: 'SpecificResource',
            source: SOURCE_URI,
            selector: {
              type: 'FragmentSelector',
              value: 'xywh=0,0,100,100',
            },
          },
        };
        const selectors = w3cAnnotation(ann).getFragmentSelector();
        expect(selectors).toHaveLength(1);
        expect(selectors[0].value).toBe('xywh=0,0,100,100');
      });

      it('should return FragmentSelectors scoped to a source URI', () => {
        const ann: W3CAnnotation = {
          ...minimalAnnotation,
          target: {
            type: 'SpecificResource',
            source: SOURCE_URI,
            selector: { type: 'FragmentSelector', value: 'frag' },
          },
        };
        expect(w3cAnnotation(ann).getFragmentSelector(SOURCE_URI)).toHaveLength(
          1,
        );
        expect(
          w3cAnnotation(ann).getFragmentSelector(SOURCE_URI_2),
        ).toHaveLength(0);
      });
    });

    it('should return a deep clone from peek()', () => {
      const builder = w3cAnnotation(minimalAnnotation);
      const peeked = builder.peek();
      (peeked as any).id = 'https://example.org/anno/tampered';
      expect(builder.peek().id).toBe('https://example.org/anno/1');
    });
  });

  describe('build / validate', () => {
    it('should build a valid annotation', () => {
      const annotation = w3cAnnotation()
        .setId('https://example.org/anno/1')
        .setTarget(SOURCE_URI)
        .build();

      expect(annotation.id).toBe('https://example.org/anno/1');
      expect(annotation.type).toBe('Annotation');
      expect(annotation.target).toBe(SOURCE_URI);
    });

    it('should throw when building an invalid annotation', () => {
      expect(() => w3cAnnotation().build()).toThrow('Invalid W3C Annotation');
    });

    it('should return success from safeBuild for a valid annotation', () => {
      const result = w3cAnnotation()
        .setId('https://example.org/anno/1')
        .setTarget(SOURCE_URI)
        .safeBuild();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe('https://example.org/anno/1');
      }
    });

    it('should return errors from safeBuild for an invalid annotation', () => {
      const result = w3cAnnotation().safeBuild();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it('should return no issues from validate for a valid annotation', () => {
      const issues = w3cAnnotation()
        .setId('https://example.org/anno/1')
        .setTarget(SOURCE_URI)
        .validate();
      expect(issues).toHaveLength(0);
    });

    it('should return issues from validate for an invalid annotation', () => {
      const issues = w3cAnnotation().validate();
      expect(issues.length).toBeGreaterThan(0);
    });
  });

  describe('chaining', () => {
    it('should support fluent chaining for a full annotation', () => {
      const annotation = w3cAnnotation()
        .setId('https://example.org/anno/1')
        .setMotivation('oa:commenting')
        .setTarget({
          type: 'SpecificResource',
          source: SOURCE_URI,
        })
        .updateTextQuoteSelector({ exact: 'Hello', prefix: 'Say ' })
        .updateTextPositionSelector({ start: 4, end: 9 })
        .updateTextualBody('Great quote!', 'oa:commenting')
        .setCreator({ type: 'Person', name: 'Test User' })
        .setCreated('2024-01-01T00:00:00Z')
        .build();

      expect(annotation.id).toBe('https://example.org/anno/1');
      expect(annotation.motivation).toBe('oa:commenting');

      const body = annotation.body as W3CTextualBody;
      expect(body.value).toBe('Great quote!');
    });
  });

  describe('w3cAnnotation factory', () => {
    it('should return a W3CAnnotationBuilder instance', () => {
      expect(w3cAnnotation()).toBeInstanceOf(W3CAnnotationBuilder);
    });

    it('should accept an existing annotation', () => {
      const builder = w3cAnnotation(minimalAnnotation);
      expect(builder.peek().id).toBe('https://example.org/anno/1');
    });
  });
});
