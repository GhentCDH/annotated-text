import {
  AnnotationEventData,
  AnnotationEventType,
  Debugger,
  ErrorEventCallback,
  EventCallback,
} from "@ghentcdh/vue-component-annotated-text";
import { ErrorCode, Errors } from "../compute/model/errors";

export type EventListenerType = AnnotationEventType | "all";

export class EventListener {
  private readonly eventMap = new Map<EventListenerType, EventCallback[]>();
  private readonly errorSet: ErrorEventCallback[] = [];

  constructor() {
    this.eventMap.set("all", []);
  }

  public register(event: EventListenerType, callback: EventCallback) {
    if (!this.eventMap.has(event)) {
      this.eventMap.set(event, []);
    }

    this.eventMap.get(event).push(callback);
  }

  public registerError(event: EventListenerType, callback: ErrorEventCallback) {
    this.errorSet.push(callback);
  }

  public sendError(error: ErrorCode, message: string, ...params: any[]) {
    Debugger.warn(`[${Errors[error]}] - `, message, ...params);
    this.errorSet.forEach((callback) =>
      callback({ code: error, error: Errors[error], message, params }),
    );
  }

  public sendEvent<DATA extends AnnotationEventData = AnnotationEventData>(
    event: AnnotationEventType,
    mouseEvent: MouseEvent | undefined | null,
    data: DATA,
  ) {
    const callbacks = [
      this.eventMap.get(event),
      this.eventMap.get("all"),
    ].flat();
    for (const callback of callbacks) {
      if (!callback) continue;
      callback({ event, mouseEvent, data });
    }
  }
}
