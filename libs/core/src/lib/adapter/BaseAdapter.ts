import { BaseAnnotationDiFn } from '../di/BaseAnnotationDiFn';

export abstract class BaseAdapter extends BaseAnnotationDiFn {
  /**
   * Name of the adapter. Be unique :-).
   */
  abstract name: string;
  private configListener: (() => void) | null = null;

  /**
   * Set a listener for configuration changes.
   * @param callback
   */
  setConfigListener(callback: () => void) {
    this.configListener = callback;
  }

  changeConfig() {
    this.configListener?.();
  }
}
