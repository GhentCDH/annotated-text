import { camelize, getCurrentInstance, toHandlerKey } from "vue";

/**
 * @deprecated
 * @param eventName
 */
export function hasCustomEventListener(eventName: string) {
  const instance = getCurrentInstance();
  if (!instance) {
    return false;
  }
  const props = instance.vnode.props;
  if (!props) {
    return false;
  }

  const handler =
    props[toHandlerKey(eventName)] ||
    // also try camelCase event handler (#2249)
    props[toHandlerKey(camelize(eventName))];

  return Boolean(handler);
}
