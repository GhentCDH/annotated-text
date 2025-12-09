import { beforeEach, describe, expect, it } from 'vitest';
import { WordSnapper } from '../WordSnapper';
import { TextAnnotation } from '../../../../../model';

describe('WordSnapper', () => {
  let snapper: WordSnapper;

  beforeEach(() => {
    snapper = new WordSnapper();
  });

  // TODO add more examples

  describe('validation - always returns valid results', () => {
    it.each`
      text             | start | end   | expectedStart | expectedEnd | description
      ${'Hello world'} | ${0}  | ${0}  | ${0}          | ${5}        | ${'zero-length at start'}
      ${'Hello world'} | ${5}  | ${5}  | ${0}          | ${5}        | ${'zero-length at boundary'}
      ${'Hello world'} | ${11} | ${11} | ${6}          | ${11}       | ${'zero-length at end'}
      ${'a b c d e'}   | ${0}  | ${1}  | ${0}          | ${1}        | ${'minimal selection'}
      ${'test'}        | ${2}  | ${2}  | ${0}          | ${4}        | ${'zero-length mid-word'}
    `(
      'should make valid from $description',
      ({ text, start, end, expectedStart, expectedEnd }) => {
        snapper.setText(text, 0);

        const result = snapper.fixOffset({
          start,
          end,
        } as TextAnnotation);

        expect(result.start).toBe(expectedStart);
        expect(result.end).toBe(expectedEnd);
        expect(result.start).toBeLessThan(result.end);
        expect(result.modified).toBe(
          start === expectedStart && end === expectedEnd ? false : true,
        );
      },
    );
  });

  describe('real-world scenarios', () => {
    it.each`
      text                                                          | start | end   | expectedStart | expectedEnd | scenario
      ${'The quick brown fox jumps over the lazy dog.'}             | ${10} | ${25} | ${10}         | ${25}       | ${'multi-word selection'}
      ${'The quick brown fox jumps over the lazy dog.'}             | ${20} | ${24} | ${20}         | ${25}       | ${'jumps'}
      ${'The quick brown fox jumps over the lazy dog.'}             | ${21} | ${30} | ${20}         | ${30}       | ${'jumps over'}
      ${'The quick brown fox jumps over the lazy dog.'}             | ${23} | ${30} | ${26}         | ${30}       | ${'over'}
      ${'The quick brown fox jumps over the lazy dog.'}             | ${21} | ${22} | ${20}         | ${25}       | ${'jumps'}
      ${'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'} | ${0}  | ${60} | ${0}          | ${56}       | ${'long sentence'}
      ${'Word1, Word2; Word3: Word4! Word5?'}                       | ${7}  | ${20} | ${7}          | ${20}       | ${'multiple punctuation'}
    `(
      // ${"CamelCaseWord snake_case_word kebab-case-word"}            | ${0}  | ${40} | ${0}          | ${44}       | ${"different naming conventions"}

      //// ${"Unicode: café, naïve, 北京"}                               | ${9}  | ${20} | ${9}          | ${23}       | ${"unicode characters"}
      // ${"Emoji 😀 test 🎉 content"}                                 | ${6}  | ${20} | ${6}          | ${21}       | ${"emoji in text"}
      'should handle $scenario',
      ({ text, start, end, expectedStart, expectedEnd }) => {
        snapper.setText(text, 0);
        const result = snapper.fixOffset({
          start,
          end,
        } as TextAnnotation);

        expect(result.start).toBe(expectedStart);
        expect(result.end).toBe(expectedEnd);
        expect(result.start).toBeLessThan(result.end);
      },
    );
  });

  describe('getWords', () => {
    const helloWorld = 'Hello world';
    describe('Hello world', () => {
      it.each`
        start | end   | expectedStart | expectedEnd | expectedSelection | description
        ${0}  | ${5}  | ${0}          | ${5}        | ${'Hello'}        | ${'select \'Hello\''}
        ${0}  | ${4}  | ${0}          | ${5}        | ${'Hello'}        | ${'select \'Hello\''}
        ${0}  | ${2}  | ${0}          | ${5}        | ${'Hello'}        | ${'select \'Hello\''}
        ${3}  | ${5}  | ${0}          | ${5}        | ${'Hello'}        | ${'select \'Hello\''}
        ${3}  | ${7}  | ${0}          | ${5}        | ${'Hello'}        | ${'select \'Hello\''}
        ${6}  | ${10} | ${6}          | ${11}       | ${'world'}        | ${'select \'World\''}
        ${6}  | ${7}  | ${6}          | ${11}       | ${'world'}        | ${'select \'World\''}
        ${2}  | ${9}  | ${0}          | ${11}       | ${'Hello world'}  | ${'select \'Hello World\''}
      `(
        'should make valid from $description',
        ({ start, end, expectedStart, expectedEnd, expectedSelection }) => {
          snapper.setText(helloWorld, 0);

          const result = snapper.fixOffset({
            start,
            end,
          } as TextAnnotation);

          expect(expectedSelection).toBe(
            helloWorld.substring(result.start, result.end),
          );
          expect(result.start).toBe(expectedStart);
          expect(result.end).toBe(expectedEnd);
          expect(result.start).toBeLessThan(result.end);
          expect(result.modified).toBe(
            start === expectedStart && end === expectedEnd ? false : true,
          );
        },
      );
    });
  });
});
