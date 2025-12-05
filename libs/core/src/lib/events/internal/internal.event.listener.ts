import { Debugger } from "@ghentcdh/annotated-text";
import { InternalEvent, InternalEventData } from "./internal.events";

export type InternalEventListenerType = InternalEvent;

export type EventData<DATA> = {
  event: InternalEvent;
  mouseEvent?: MouseEvent | undefined | null;
  data: DATA;
};

export type EventCallback<DATA> = (event: EventData<DATA>) => void;

export class InternalEventListener {
  private readonly eventMap = new Map<
    InternalEventListenerType,
    EventCallback<any>[]
  >();

  constructor() {}

  public on<EVENT extends InternalEvent>(
    event: EVENT,
    callback: EventCallback<InternalEventData[EVENT]>,
  ): void {
    if (!this.eventMap.has(event)) {
      this.eventMap.set(event, []);
    }

    this.eventMap.get(event)?.push(callback);
  }

  // Block state is not for internal events, but just a state f.e. preventing creating annotations during certain operations
  private block = false;

  public get isBlocking() {
    return this.block;
  }

  public blockEvents(reason: string): void {
    Debugger.debug("InternalEventListener", `Events  "blocked": ${reason}`);
    this.block = true;
  }

  public unBlockEvents(reason: string): void {
    Debugger.debug("InternalEventListener", `Events "unblocked": ${reason}`);
    this.block = false;
  }

  public sendEvent<EVENT extends InternalEvent>(
    event: EVENT,
    data: InternalEventData[EVENT],
    mouseEvent?: MouseEvent | undefined | null,
  ): void {
    const callbacks = this.eventMap.get(event) ?? [];

    for (const callback of callbacks) {
      if (!callback) continue;
      callback({ event, mouseEvent, data });
    }
  }
}
