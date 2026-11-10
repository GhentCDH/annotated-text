import { describe, expect, it, vi } from 'vitest';
import { EditAnnotation } from '../edit.annotations';
import { DragAnnotation } from '../drag.annotations';
import { Draw } from '../../Draw';
import { InternalEventListener } from '../../../../events/internal/internal.event.listener';
import { EventListener } from '../../../../events/event.listener';
import { type AnnotationModule } from '../../../../di/annotation.module';
import { type TextAnnotation } from '../../../../model';
import { type Position } from '../../types';

// Draw is only used as an injection token; the real module has circular imports
vi.mock('../../Draw', () => ({ Draw: class Draw {} }));

// Only start/end change during an edit: skip the full schema validation
vi.mock('../../../../model', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  textAnnotationSchema: { parse: (value: unknown) => value },
}));

type Snap = (range: { start: number; end: number }) => {
  start: number;
  end: number;
};

const setup = ({ snap = (range) => range }: { snap?: Snap } = {}) => {
  const internalEventListener = new InternalEventListener();
  const internalEvents: string[] = [];
  internalEventListener.on('annotation--update', ({ data }) =>
    internalEvents.push(
      `annotation--update ${data.annotation.start}-${data.annotation.end}`,
    ),
  );
  const externalEvents: string[] = [];
  internalEventListener.on('send-event--annotation', ({ data }) =>
    externalEvents.push(
      `${data.event} ${data.additionalData.annotation.start}-${data.additionalData.annotation.end}`,
    ),
  );

  const draw = {
    annotation: { dummy: vi.fn(), removeDraw: vi.fn(), setClass: vi.fn() },
    tag: { removeTag: vi.fn(), drawTag: vi.fn() },
  };

  const module = {
    inject: (token: unknown) => {
      if (token === InternalEventListener) return internalEventListener;
      if (token === EventListener) return { sendEvent: vi.fn() };
      if (token === Draw) return draw;
      throw new Error(`not mocked: ${String(token)}`);
    },
    getAnnotationAdapter: () => ({ edit: true }),
    getSnapper: () => ({ fixOffset: snap }),
  } as unknown as AnnotationModule;

  const annotation = {
    id: 'a',
    start: 10,
    end: 20,
    _render: { weight: 0 },
    _drawMetadata: {
      draws: [{ draggable: { start: { x: 0 }, end: { x: 100 } } }],
    },
  } as unknown as TextAnnotation;

  // Position x is the character index
  const characterAt = ({ x }: Position) => ({
    characterPos: x,
    newIndex: x,
    side: 'left' as const,
  });

  return {
    module,
    annotation,
    characterAt,
    draw,
    internalEventListener,
    internalEvents,
    externalEvents,
  };
};

const event = {} as MouseEvent;
const at = (x: number): Position => ({ x, y: 0 });

describe('annotation edit lifecycle', () => {
  describe('EditAnnotation (resize handle)', () => {
    it.each`
      scenario                                 | moves       | snap
      ${'released without moving'}             | ${[]}       | ${undefined}
      ${'snapper collapses the range'}         | ${[15]}     | ${() => ({ start: 5, end: 5 })}
      ${'moved back to the original position'} | ${[12, 10]} | ${undefined}
      ${'normal edit'}                         | ${[12]}     | ${undefined}
    `('should unblock events after "$scenario"', ({ moves, snap }) => {
      const t = setup({ snap });
      const edit = new EditAnnotation(t.annotation, t.module, t.characterAt);

      edit.start(at(10), 'start', event);
      expect(t.internalEventListener.isBlocking).toBe(true);
      moves.forEach((x: number) => edit.move(at(x), 'start', event));
      edit.end(event);

      expect(t.internalEventListener.isBlocking).toBe(false);
    });

    it('should restore the tag and emit nothing when released without moving', () => {
      const t = setup();
      const edit = new EditAnnotation(t.annotation, t.module, t.characterAt);

      edit.start(at(10), 'start', event);
      edit.end(event);

      expect(t.draw.tag.removeTag).toHaveBeenCalledWith('a');
      expect(t.draw.tag.drawTag).toHaveBeenCalledWith(t.annotation);
      expect(t.internalEvents).toEqual([]);
      expect(t.externalEvents).toEqual(['annotation-edit--start 10-20']);
    });

    it('should update the annotation and emit the new range after an edit', () => {
      const t = setup();
      const edit = new EditAnnotation(t.annotation, t.module, t.characterAt);

      edit.start(at(10), 'start', event);
      edit.move(at(12), 'start', event);
      edit.end(event);

      expect(t.internalEvents).toEqual(['annotation--update 12-20']);
      expect(t.externalEvents).toEqual([
        'annotation-edit--start 10-20',
        'annotation-edit--move 12-20',
        'annotation-edit--end 12-20',
      ]);
    });

    it('should allow a new edit after an aborted one', () => {
      const t = setup();
      const edit = new EditAnnotation(t.annotation, t.module, t.characterAt);

      edit.start(at(10), 'start', event);
      edit.end(event);
      edit.start(at(10), 'start', event);
      edit.move(at(14), 'start', event);
      edit.end(event);

      expect(t.internalEvents).toEqual(['annotation--update 14-20']);
      expect(t.externalEvents).toEqual([
        'annotation-edit--start 10-20',
        'annotation-edit--start 10-20',
        'annotation-edit--move 14-20',
        'annotation-edit--end 14-20',
      ]);
    });

    it('should ignore moves and ends without a start', () => {
      const t = setup();
      const edit = new EditAnnotation(t.annotation, t.module, t.characterAt);
      t.internalEventListener.blockEvents('another edit');

      edit.start(at(10), 'start', event);
      edit.move(at(12), 'start', event);
      edit.end(event);

      // the other edit still holds the block
      expect(t.internalEventListener.isBlocking).toBe(true);
      expect(t.draw.annotation.dummy).not.toHaveBeenCalled();
    });
  });

  describe('DragAnnotation (move the whole annotation)', () => {
    it.each`
      scenario                | draws
      ${'no draws'}           | ${[]}
      ${'no draggable'}       | ${[{}]}
      ${'no draggable start'} | ${[{ draggable: { end: { x: 100 } } }]}
    `('should not throw and unblock events with "$scenario"', ({ draws }) => {
      const t = setup();
      t.annotation._drawMetadata.draws = draws;
      const drag = new DragAnnotation(0, t.annotation, t.module, t.characterAt);

      expect(() => drag.start(at(12), 'start', event)).not.toThrow();
      drag.move(at(15), 'start', event);
      drag.end(event);

      expect(t.internalEventListener.isBlocking).toBe(false);
      expect(t.internalEvents).toEqual([]);
      expect(t.draw.annotation.setClass).toHaveBeenLastCalledWith('a', '');
    });

    it('should move the annotation by the dragged distance', () => {
      const t = setup();
      const drag = new DragAnnotation(0, t.annotation, t.module, t.characterAt);

      drag.start(at(12), 'start', event);
      expect(t.draw.annotation.setClass).toHaveBeenCalledWith('a', 'move');
      drag.move(at(15), 'start', event);
      drag.end(event);

      expect(t.internalEventListener.isBlocking).toBe(false);
      expect(t.internalEvents).toEqual(['annotation--update 13-23']);
    });

    it('should unblock events when picking up throws', () => {
      const t = setup();
      const drag = new DragAnnotation(0, t.annotation, t.module, () => {
        throw new Error('boom');
      });

      expect(() => drag.start(at(12), 'start', event)).toThrow('boom');
      expect(t.internalEventListener.isBlocking).toBe(false);
    });
  });
});
