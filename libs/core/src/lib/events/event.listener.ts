import {
  type AnnotationEventType,
  type ErrorEventCallback,
  type EventCallback,
  EventData,
} from './events';
import { type ErrorCode, Errors } from './errors';
import { Debugger } from '../utils/debugger';

export class EventListener {
  private readonly eventMap = new Map<
    AnnotationEventType,
    EventCallback<any>[]
  >();
  private readonly errorSet: ErrorEventCallback[] = [];

  constructor() {
    this.eventMap.set('all', []);
  }

  public register<EVENT extends AnnotationEventType>(
    event: AnnotationEventType,
    callback: EventCallback<EVENT>,
  ) {
    if (!this.eventMap.has(event)) {
      this.eventMap.set(event, []);
    }

    this.eventMap.get(event)?.push(callback);
  }

  public registerError(callback: ErrorEventCallback) {
    this.errorSet.push(callback);
  }

  public sendError(error: ErrorCode, message: string, ...params: any[]) {
    Debugger.warn(`[${Errors[error]}] - `, message, ...params);
    this.errorSet.forEach((callback) =>
      callback({ code: error, error: Errors[error], message, params }),
    );
  }

  public sendEvent<EVENT extends AnnotationEventType>(
    event: EVENT,
    data: EventData[EVENT],
    mouseEvent?: MouseEvent | undefined | null,
  ): void {
    const callbacks = [
      this.eventMap.get(event),
      this.eventMap.get('all'),
    ].flat();
    for (const callback of callbacks) {
      if (!callback) continue;
      callback({ event, mouseEvent, data } as any);
    }
  }
}
