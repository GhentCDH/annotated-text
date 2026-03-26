import { describe, expect, it } from 'vitest';
import {
  replaceMarkdownToHtml,
  stripHtmlFromText,
  getPartialMarkdownWithLimit,
  selectTextFromMarkdown,
} from '../parser';

describe('parser', () => {
  describe('replaceMarkdownToHtml', () => {
    it('should render plain text as a paragraph', () => {
      const result = replaceMarkdownToHtml('hello world');
      expect(result.trim()).toBe('<p>hello world</p>');
    });

    it('should render bold text', () => {
      const result = replaceMarkdownToHtml('**bold**');
      expect(result.trim()).toBe('<p><strong>bold</strong></p>');
    });

    it('should render italic text', () => {
      const result = replaceMarkdownToHtml('*italic*');
      expect(result.trim()).toBe('<p><em>italic</em></p>');
    });

    it('should render inline code', () => {
      const result = replaceMarkdownToHtml('`code`');
      expect(result.trim()).toBe('<p><code>code</code></p>');
    });

    it('should render a heading', () => {
      const result = replaceMarkdownToHtml('# Heading');
      expect(result.trim()).toBe('<h1>Heading</h1>');
    });

    it('should render mixed inline markup', () => {
      const result = replaceMarkdownToHtml('hello **bold** and *italic*');
      expect(result.trim()).toBe(
        '<p>hello <strong>bold</strong> and <em>italic</em></p>',
      );
    });
  });

  describe('stripHtmlFromText', () => {
    it('should return empty string when no DOM is available', () => {
      // In a node environment (no document), stripHtmlFromText falls back to empty string
      expect(stripHtmlFromText('<p>hello</p>')).toBe('');
    });

    it('should return empty string for empty input', () => {
      expect(stripHtmlFromText('')).toBe('');
    });
  });

  describe('getPartialMarkdownWithLimit', () => {
    it('should extract plain text within range', () => {
      const result = getPartialMarkdownWithLimit('hello world', {
        start: 0,
        end: 5,
      });
      expect(result.markdownText).toBe('hello');
      expect(result.start).toBe(0);
      expect(result.end).toBe(5);
    });

    it('should extract text from the middle of a string', () => {
      const result = getPartialMarkdownWithLimit('hello world', {
        start: 6,
        end: 11,
      });
      expect(result.markdownText).toBe('world');
    });

    it('should preserve bold markup when selecting inside bold text', () => {
      const text = '**bold text**';
      // plain text content: "bold text" starts at 0
      const result = getPartialMarkdownWithLimit(text, {
        start: 0,
        end: 4,
      });
      expect(result.markdownText).toContain('bold');
    });

    it('should apply startOffset to character positions', () => {
      const result = getPartialMarkdownWithLimit(
        'hello world',
        { start: 10, end: 15 },
        10,
      );
      expect(result.markdownText).toBe('hello');
      expect(result.start).toBe(10);
      expect(result.end).toBe(15);
    });

    it('should return rendered html alongside markdownText', () => {
      const result = getPartialMarkdownWithLimit('**bold**', {
        start: 0,
        end: 4,
      });
      expect(result.html).toBeTruthy();
      expect(result.markdownText).toBeTruthy();
    });

    it('should return empty result when range is outside text', () => {
      const result = getPartialMarkdownWithLimit('hello', {
        start: 100,
        end: 200,
      });
      expect(result.markdownText).toBe('');
    });

    it('should keep full lines when ignoreLines is true', () => {
      const text = 'hello world';
      const result = getPartialMarkdownWithLimit(text, {
        start: 2,
        end: 8,
        ignoreLines: true,
      });
      expect(result.markdownText).toBe('hello world');
    });

    it('should preserve markup markers for bold text in range', () => {
      const text = 'hello **bold** world';
      const result = getPartialMarkdownWithLimit(text, {
        start: 0,
        end: 16,
      });
      expect(result.markdownText).toContain('hello');
      expect(result.markdownText).toContain('**');
    });

    it('should include markup markers around bold text', () => {
      const text = 'hello **bold** world';
      const result = getPartialMarkdownWithLimit(text, {
        start: 0,
        end: 10,
      });
      // result includes the text content plus ** markup markers
      expect(result.markdownText).toContain('hello');
      expect(result.markdownText).toContain('**');
    });
  });

  describe('selectTextFromMarkdown', () => {
    it('should delegate to getPartialMarkdownWithLimit', () => {
      const directResult = getPartialMarkdownWithLimit(
        'hello world',
        { start: 0, end: 5 },
        0,
      );
      const selectResult = selectTextFromMarkdown('hello world', 0, 5);

      expect(selectResult).toEqual(directResult);
    });

    it('should pass offset to getPartialMarkdownWithLimit', () => {
      const directResult = getPartialMarkdownWithLimit(
        'hello world',
        { start: 10, end: 15 },
        10,
      );
      const selectResult = selectTextFromMarkdown('hello world', 10, 15, 10);

      expect(selectResult).toEqual(directResult);
    });

    it('should default offset to 0', () => {
      const result = selectTextFromMarkdown('hello world', 0, 5);
      expect(result.markdownText).toBe('hello');
      expect(result.start).toBe(0);
      expect(result.end).toBe(5);
    });

    it('should select bold text correctly', () => {
      const result = selectTextFromMarkdown('**bold** plain', 0, 4);
      expect(result.markdownText).toContain('bold');
    });
  });
});