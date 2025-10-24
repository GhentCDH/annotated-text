import { pointer } from "d3";
import {
  drawDummyAnnotation,
  recreateAnnotation,
  removeDummyAnnotation,
} from "./draw";
import { Debugger } from "../../../utils/debugger";
import { SvgModel } from "../../model/svg.types";
import { type TextAnnotation } from "../../../model";
import {
  getCharacterFromTextNodesAtPoint,
  getCharacterStartEndPosition,
} from "../../position";
import { drawTag } from "../tag";

export const createNewBlock = (svgModel: SvgModel) => {
  const container = svgModel.textElement;

  const svg = svgModel.svg;
  const adapter = svgModel.annotationAdapter;

  let startIndex: number;
  let drawing = false;
  let drawingAndMove = false;
  let dummyAnnotation: TextAnnotation | null = null;
  let prevEndIndex: number | null = null;

  const createInitialDummyAnnotation = (characterPos: number) => {
    dummyAnnotation = {
      ...adapter.createAnnotation(),
      weight: 0,
      start: characterPos,
      end: characterPos + 1,
    } as unknown as TextAnnotation;
    startIndex = characterPos;
    prevEndIndex = characterPos + 1;

    return dummyAnnotation;
  };

  const createDummyAnnotation = (event: any, draw = false) => {
    const [clientX, clientY] = pointer(event);
    // const [x, y] = pointer(event);
    const x = clientX + container.getBoundingClientRect().x;
    const y = clientY + container.getBoundingClientRect().y;
    const character = getCharacterFromTextNodesAtPoint(x, y, svgModel);

    if (!character) return;
    if (!dummyAnnotation) {
      dummyAnnotation = createInitialDummyAnnotation(character.characterPos);
    }

    const { start, end } = getCharacterStartEndPosition(
      character,
      { start: startIndex, end: prevEndIndex! },
      "end",
    );

    if (start === end) return;

    dummyAnnotation.start = start;
    dummyAnnotation.end = end;

    const snapper = svgModel.annotationAdapter.snapper.fixOffset(
      start < end ? "move-start" : "move-end",
      dummyAnnotation,
    );
    dummyAnnotation.start = snapper.start;
    dummyAnnotation.end = snapper.end;

    if (draw)
      drawDummyAnnotation(svgModel, dummyAnnotation, {
        border: dummyAnnotation.color!.border,
        fill: dummyAnnotation.color!.background,
      });
    prevEndIndex = character.characterPos;
    return { x, y };
  };

  const startCreateAnnotation = (event: any) => {
    if (!svgModel.annotationAdapter.create) return;
    if (svgModel.model.blockEvents || drawing) return;
    dummyAnnotation = null;
    drawing = true;
    createDummyAnnotation(event);

    if (!dummyAnnotation) {
      console.warn("no character found");
      return;
    }

    svgModel.sendEvent(
      {
        event: "annotation-create--start",
        mouseEvent: event,
        annotationUuid: (dummyAnnotation as TextAnnotation).id || "",
      },
      { annotation: dummyAnnotation },
    );
  };

  svg.on("mousedown", startCreateAnnotation);

  svg.on("mousemove", (event) => {
    if (!drawing) return;

    svgModel.model.blockEvents = true;
    drawingAndMove = true;
    createDummyAnnotation(event, true);

    svgModel.sendEvent(
      {
        event: "annotation-create--move",
        mouseEvent: event,
        annotationUuid: dummyAnnotation?.id || "",
      },
      { annotation: dummyAnnotation },
    );
  });

  svg.on("mouseup", (mouseEvent) => {
    prevEndIndex = null;
    drawing = false;

    if (!drawingAndMove) return;

    drawingAndMove = false;
    svgModel.model.blockEvents = false;
    removeDummyAnnotation(svgModel);

    if (!dummyAnnotation) {
      Debugger.warn("no dummy annotation found, canceling");
      return;
    }

    recreateAnnotation(svgModel, dummyAnnotation);

    svgModel.sendEvent(
      {
        event: "annotation-create--end",
        mouseEvent,
        annotationUuid: dummyAnnotation?.id || "",
      },
      { annotation: dummyAnnotation },
    );
    drawTag(svgModel, dummyAnnotation);
    dummyAnnotation = null;
  });
};
