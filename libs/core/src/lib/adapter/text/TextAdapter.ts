import { BaseAdapter } from "../BaseAdapter";
import { type TextLine } from "../../model";
import { getRanges } from "../../compute/utils/ranges/get-range";

export type TextDirection = "ltr" | "rtl";

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

export abstract class TextAdapter extends BaseAdapter {
  textDirection: TextDirection = "ltr";
  flatText: boolean = false;
  private _limit: Limit | null = null;

  /**
   * Parses the given text into an array of TextLine objects.
   * The parser is also responsible for handling text limits.
   * @param text
   */
  abstract parse(text: string): TextLine[];

  getRanges(annotation: any, line: TextLine): DOMRect[] | null {
    return getRanges(annotation, line);
  }

  set limit(limit: Limit | null | undefined) {
    this._limit = limit ?? null;
  }

  get limit() {
    return this._limit;
  }

  /**
   * Change the configuration of the adapter, it will update the eventlistener if rerendering of the annotations is needed.
   * f.e. if the text direction changes, the adapter will emit a change event to update the annotations.
   * @param key
   * @param value
   */
  setConfig<KEY extends TEXT_CONFIG_KEYS>(
    key: KEY,
    value: TEXT_CONFIG_VALUES<KEY>,
  ) {
    switch (key) {
      case "textDirection":
        this.textDirection = value as TextDirection;
        this.changeConfig();
        break;
      case "flatText":
        this.flatText = !!value;
        this.changeConfig();
        break;
      case "limit":
        this.limit = value as Limit | null;
        this.changeConfig();
        break;
      default:
        console.warn("Unsupported config key:", value);
      // super.setConfig(value, key);
    }
  }
}

type CONFIG = InstanceType<typeof TextAdapter>;
export type TEXT_CONFIG_KEYS = keyof CONFIG;
export type TEXT_CONFIG_VALUES<K extends TEXT_CONFIG_KEYS> = CONFIG[K];

export type createTextAdapterParams = {
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
};

export const createTextAdapter = (
  adapter: TextAdapter,
  params: createTextAdapterParams,
): TextAdapter => {
  if (params.textDirection) {
    adapter.textDirection = params.textDirection;
  }
  adapter.flatText = !!params.flatText;
  adapter.limit = params.limit;

  return adapter;
};
