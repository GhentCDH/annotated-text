import { pick } from 'lodash-es';
import { BaseAdapter } from '../BaseAdapter';
import { type TextLine } from '../../model';

export type TextDirection = 'ltr' | 'rtl';

export type Limit = {
  /**
   * The start position in the text from which to consider lines.
   * This is inclusive.
   **/
  start: number;
  /**
   * The end position in the text up to which to consider lines.
   * This is exclusive.
   **/
  end: number;
  /**
   * If true, characters that are outside the range will be ignored.
   * If false, lines that intersect with the range will be included.
   * Defaults to false.
   */
  ignoreLines?: boolean;
} | null;

export const DefaultTextAdapterStyle = {
  padding: 6,
  lineOffset: 2,
  lineHeight: 22,
};

export type TextAdapterStyle = typeof DefaultTextAdapterStyle;

export abstract class TextAdapter<
  PARAMS extends TextAdapterParams = TextAdapterParams,
> extends BaseAdapter<PARAMS> {
  textDirection: TextDirection = 'ltr';
  flatText = false;
  limit: Limit | null = null;
  style: TextAdapterStyle = { ...DefaultTextAdapterStyle };
  public textLength = 0;

  public lines: TextLine[] = [];

  /**
   * Parses the given text into an array of TextLine objects.
   * The parser is also responsible for handling text limits.
   * @param text
   */
  abstract parse(text: string): TextLine[];

  getLimit(lines?: TextLine[]) {
    if (!this.limit) return null;
    lines = lines ?? this.lines;

    if (this.limit.ignoreLines || lines.length === 0)
      return pick(this.limit, ['start', 'end']);

    const start = Math.min(this.limit.start, lines[0].start);
    const end = Math.max(this.limit.end, lines[lines.length - 1].end);

    return { start, end };
  }

  public setLines(lines: TextLine[]) {
    this.lines = lines;
    this.clear();
  }

  public setLineHeight(height: number) {
    this.style = {
      ...this.style,
      lineHeight: height,
    };
  }

  setParams(params: PARAMS) {
    this.textDirection = params.textDirection ?? this.textDirection ?? 'ltr';
    this.flatText = params.flatText ?? this.flatText ?? false;
    this.style = Object.assign(
      this.style ?? { ...DefaultTextAdapterStyle },
      params.style ?? {},
    );

    if (params.limit === null) {
      this.limit = null;
    } else {
      this.limit = params.limit ?? this.limit;
    }
  }

  getLine(lineUid: string) {
    return this.lines.find((line) => line.uuid === lineUid);
  }

  clear() {
    this.textLength = 0;
    this.lines.forEach((line) => {
      if (this.textLength < line.end) {
        this.textLength = line.end;
      }
    });
  }
}

type CONFIG = InstanceType<typeof TextAdapter>;
export type TEXT_CONFIG_KEYS = keyof CONFIG;
export type TEXT_CONFIG_VALUES<K extends TEXT_CONFIG_KEYS> = CONFIG[K];

export type TextAdapterParams = {
  /**
   * The text direction for the adapter.
   * Can be either 'ltr' (left-to-right) or 'rtl' (right-to-left).
   * Defaults to 'ltr'.
   */
  textDirection?: TextDirection;
  /**
   * If true, the adapter will return flat text instead of HTML.
   * This is useful for plain text processing or when HTML formatting is not needed.
   * Defaults to false.
   */
  flatText?: boolean;
  /**
   * Defines the range of positions in the text that the adapter should consider.
   * Each lines that intersects with this range will be included in the output.
   */
  limit?: Limit | null;

  style?: Partial<Omit<TextAdapterStyle, 'lineHeight'>>;
};
