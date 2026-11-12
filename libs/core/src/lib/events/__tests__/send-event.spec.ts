import { describe, expect, it, vi } from 'vitest';

import { type AnnotationModule } from '../../di/annotation.module';
import { EventListener } from '../event.listener';
import { InternalEventListener } from '../internal/internal.event.listener';
import { ExternalEventSender } from '../send-event';

const setup = () => {
  const cached = {
    id: 'a1',
    start: 10,
    end: 20,
    _render: { lines: [{ lineUid: 'l1' }] },
  };
  const eventListener = { sendEvent: vi.fn() };
  const adapter = {
    getAnnotation: vi.fn((id: string) =>
      id === cached.id ? cached : undefined,
    ),
    format: vi.fn((annotation: unknown) => annotation),
  };

  const module = {
    inject: (token: unknown) => {
      if (token === EventListener) return eventListener;
      if (token === InternalEventListener) return {};
      throw new Error(`not mocked: ${String(token)}`);
    },
    getAnnotationAdapter: () => adapter,
  } as unknown as AnnotationModule;

  return {
    cached,
    eventListener,
    adapter,
    sender: new ExternalEventSender(module),
  };
};

describe('ExternalEventSender', () => {
  it('should not mutate the cached annotation when merging additionalData', () => {
    const { sender, cached } = setup();
    const snapshot = structuredClone(cached);

    sender.sendEvent({ event: 'annotation-edit--move', annotationUuid: 'a1' }, {
      annotation: { start: 10, end: 31 },
    } as any);

    expect(cached).toEqual(snapshot);
  });

  it('should dispatch the merged values to listeners', () => {
    const { sender, eventListener } = setup();

    sender.sendEvent({ event: 'annotation-edit--move', annotationUuid: 'a1' }, {
      annotation: { start: 12, end: 31 },
    } as any);

    expect(eventListener.sendEvent).toHaveBeenCalledWith(
      'annotation-edit--move',
      {
        annotation: expect.objectContaining({ id: 'a1', start: 12, end: 31 }),
        annotationUuid: 'a1',
      },
      undefined,
    );
  });

  it('should share _render by reference instead of deep-copying it', () => {
    const { sender, cached, adapter } = setup();

    sender.sendEvent({ event: 'annotation-edit--move', annotationUuid: 'a1' }, {
      annotation: { start: 10, end: 31 },
    } as any);

    expect(adapter.format.mock.calls[0][0]._render).toBe(cached._render);
  });

  it('should send the cached annotation as is without additionalData', () => {
    const { sender, cached, adapter } = setup();

    const result = sender.sendEvent({ event: 'click', annotationUuid: 'a1' });

    expect(adapter.format.mock.calls[0][0]).toBe(cached);
    expect(result).toBe(cached);
  });

  it('should send a new annotation that is not in the cache yet', () => {
    const { sender, adapter } = setup();
    const created = { id: 'new', start: 1, end: 5 };

    sender.sendEvent(
      { event: 'annotation-create--move', annotationUuid: 'new' },
      { annotation: created } as any,
    );

    expect(adapter.format.mock.calls[0][0]).toEqual(created);
  });
});
