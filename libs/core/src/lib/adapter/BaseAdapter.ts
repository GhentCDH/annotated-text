import { BaseAnnotationDiFn } from '../di/BaseAnnotationDiFn';

export abstract class BaseAdapter<PARAMS> extends BaseAnnotationDiFn {
  /**
   * Name of the adapter. Be unique :-).
   */
  abstract name: string;

  constructor(params: PARAMS) {
    super();
    this.setParams(params);
  }

  abstract setParams(params: PARAMS): void;
}
