import { getCurrentInstance, toHandlerKey, camelize } from "vue";

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