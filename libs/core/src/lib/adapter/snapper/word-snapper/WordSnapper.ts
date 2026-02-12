import RBush from 'rbush';
import { defaultTokenizr, type Tokenizer } from './tokenizer';
import { DefaultSnapper, type SnapperResult } from '../snapper';
import { type TextAnnotation } from '../../../model';

export interface WordPosition {
  start: number; // inclusive
  end: number; // inclusive
  word: string;
}

// RBush item interface for spatial indexing
interface WordBBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  word: WordPosition;
}

export class WordSnapper extends DefaultSnapper {
  private tokenizer: Tokenizer;
  private words: WordPosition[] = [];
  private tree: RBush<WordBBox>;

  constructor(tokenizer: Tokenizer = defaultTokenizr) {
    super();
    this.tokenizer = tokenizer;
    this.tree = new RBush<WordBBox>();
  }

  override setText(text: string, offsetStart: number) {
    const isSame = this.text === text && this.offsetStart === offsetStart;
    if (isSame) {
      return;
    }

    super.setText(text, offsetStart);

    this.words = this.parseWords();
    this.buildTree();
  }

  /**
   * Parse the text into words using the tokenizer.
   * Each word has a start (inclusive) and end (inclusive) position.
   */
  private parseWords(): WordPosition[] {
    const tokens = this.tokenizer(this.text);
    const words: WordPosition[] = [];

    for (const token of tokens) {
      if (token.type === 'token' || token.type === 'start') {
        const start = token.pos + this.offsetStart;
        const end = token.pos + token.text.length + this.offsetStart; // inclusive end
        words.push({ start, end, word: token.text });
      }
    }
    return words;
  }

  /**
   * Build the R-tree spatial index from words.
   */
  private buildTree(): void {
    this.tree.clear();

    const items: WordBBox[] = this.words.map((word) => ({
      minX: word.start,
      maxX: word.end,
      minY: 0,
      maxY: 0,
      word,
    }));

    this.tree.load(items);
  }

  override fixOffset(annotation: TextAnnotation): SnapperResult {
    if (this.words.length === 0) {
      return {
        start: annotation.start,
        end: annotation.end,
        modified: false,
      };
    }

    const snappedStart = this.snapStart(annotation.start);
    const snappedEnd = this.snapEnd(annotation.end);

    // Ensure at least one word is covered
    let finalStart = snappedStart;
    let finalEnd = snappedEnd;

    if (finalStart > finalEnd || !this.hasWordInRange(finalStart, finalEnd)) {
      // No word covered - expand to include the word at the original midpoint
      const midpoint = Math.floor((annotation.start + annotation.end) / 2);
      const wordAtMidpoint =
        this.findWordContaining(midpoint) || this.findClosestWord(midpoint);

      if (wordAtMidpoint) {
        finalStart = wordAtMidpoint.start;
        finalEnd = wordAtMidpoint.end;
      }
    }

    return {
      start: finalStart,
      end: finalEnd,
      modified: finalStart !== annotation.start || finalEnd !== annotation.end,
    };
  }

  /**
   * Snap start position using halfway rule.
   * - If in first half of word: snap to word start (include word)
   * - If in second half of word: snap to next word start (exclude word)
   * - If not in a word: snap to closest word start
   */
  protected snapStart(position: number): number {
    const word = this.findWordContaining(position);

    if (word) {
      const halfway = word.start + (word.end - word.start) / 2;

      if (position < halfway) {
        // First half - include this word
        return word.start;
      } else {
        // Second half - exclude this word, snap to next word
        const nextWord = this.findNextWord(word);
        return nextWord ? nextWord.start : word.end + 1;
      }
    }

    // Not in a word - find closest word start
    return this.findClosestWordStart(position);
  }

  /**
   * Snap end position using halfway rule.
   * - If in first half of word: snap to previous word end (exclude word)
   * - If in second half of word: snap to word end (include word)
   * - If not in a word (whitespace): keep position as-is
   */
  protected snapEnd(position: number): number {
    const word = this.findWordContaining(position);

    if (word) {
      const halfway = word.start + (word.end - word.start) / 2;

      if (position < halfway) {
        // First half - exclude this word, snap to previous word
        const prevWord = this.findPreviousWord(word);
        return prevWord ? prevWord.end : word.start - 1;
      } else {
        // Second half - include this word
        return word.end;
      }
    }

    if (position > this.textLength) {
      return this.textLength;
    }

    // Not in a word (whitespace) - keep position as-is
    return position;
  }

  /**
   * Find the word containing the given position (inclusive bounds).
   */
  protected findWordContaining(position: number): WordPosition | null {
    const results = this.tree.search({
      minX: position,
      maxX: position,
      minY: 0,
      maxY: 0,
    });

    for (const item of results) {
      if (position >= item.word.start && position <= item.word.end) {
        return item.word;
      }
    }

    return null;
  }

  /**
   * Find the word after the given word.
   */
  protected findNextWord(currentWord: WordPosition): WordPosition | null {
    const index = this.words.indexOf(currentWord);
    return index >= 0 && index < this.words.length - 1
      ? this.words[index + 1]
      : null;
  }

  /**
   * Find the word before the given word.
   */
  protected findPreviousWord(currentWord: WordPosition): WordPosition | null {
    const index = this.words.indexOf(currentWord);
    return index > 0 ? this.words[index - 1] : null;
  }

  /**
   * Find the closest word start to the given position.
   */
  protected findClosestWordStart(position: number): number {
    let closest = this.words[0];
    let minDistance = Math.abs(position - closest.start);

    for (const word of this.words) {
      const distance = Math.abs(position - word.start);
      if (distance < minDistance) {
        minDistance = distance;
        closest = word;
      }
    }

    return closest.start;
  }

  /**
   * Find the closest word end to the given position.
   */
  protected findClosestWordEnd(position: number): number {
    let closest = this.words[this.words.length - 1];
    let minDistance = Math.abs(position - closest.end);

    for (const word of this.words) {
      const distance = Math.abs(position - word.end);
      if (distance < minDistance) {
        minDistance = distance;
        closest = word;
      }
    }

    return closest.end;
  }

  /**
   * Find the closest word to the given position.
   */
  protected findClosestWord(position: number): WordPosition | null {
    if (this.words.length === 0) return null;

    let closest = this.words[0];
    let minDistance = Math.min(
      Math.abs(position - closest.start),
      Math.abs(position - closest.end),
    );

    for (const word of this.words) {
      const distance = Math.min(
        Math.abs(position - word.start),
        Math.abs(position - word.end),
      );
      if (distance < minDistance) {
        minDistance = distance;
        closest = word;
      }
    }

    return closest;
  }

  /**
   * Check if there's at least one word in the given range.
   */
  protected hasWordInRange(start: number, end: number): boolean {
    for (const word of this.words) {
      // Word overlaps with range if word.start <= end AND word.end >= start
      if (word.start <= end && word.end >= start) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the parsed words (useful for debugging/testing)
   */
  getWords(): ReadonlyArray<WordPosition> {
    return this.words;
  }
}
