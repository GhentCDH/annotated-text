import { isEqual } from 'lodash-es';

export class CacheDraw {
  private cache: Record<string, any> = {};

  updateCache(object: Record<string, any>) {
    this.cache = object;
  }

  hasChanged(object: Record<string, any>) {
    const keys = Object.keys(object);
    for (const key of keys) {
      if (!isEqual(this.cache[key], object[key])) {
        return true;
      }
    }
    return false;
  }
}
