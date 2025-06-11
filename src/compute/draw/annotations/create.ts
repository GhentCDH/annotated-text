import { pointer } from "d3";
import { Debugger } from "@ghentcdh/vue-component-annotated-text";
import {
  drawDummyAnnotation,
  getCharacterFromTextNodesAtPoint,
  removeDummyAnnotation,
} from "./draw";
import { SvgModel } from "../../model/svg.types";
import { TextAnnotation } from "../../annotation.model";
import { sendEvent1 } from "../send-events";

export const createNewBlock = (svgModel: SvgModel) => {
  const container = svgModel.textElement;
  const svg = svgModel.svg;

  let startIndex: number;
  let drawing = false;
  let dummyAnnotation: TextAnnotation | null = null;

  const createDummyAnnotation = (event) => {
    const [clientX, clientY] = pointer(event);
    // const [x, y] = pointer(event);
    const x = clientX + container.getBoundingClientRect().x;
    const y = clientY + container.getBoundingClientRect().y;
    const character = getCharacterFromTextNodesAtPoint(x, y, svgModel);
    if (!character) return;
    const newIndex = character.newIndex;
    if (!dummyAnnotation) {
      dummyAnnotation = {
        ...svgModel.model.config.visualEvent.create(),
        weight: 1,
        start: newIndex,
        end: newIndex + 5,
      } as unknown as TextAnnotation;
      startIndex = newIndex;
    }

    const isStart = newIndex > startIndex;
    const _start = isStart ? newIndex : startIndex;
    const _end = !isStart ? newIndex : startIndex;

    dummyAnnotation.start = Math.min(_start, _end);
    dummyAnnotation.end = Math.max(_start, _end);
    drawDummyAnnotation(svgModel, dummyAnnotation, {
      border: dummyAnnotation.color.border,
      fill: dummyAnnotation.color.background,
    });

    return { x, y };
  };

  svg.on("mousedown", (event) => {
    if (!svgModel.model.config.actions.create) return null;
    if (svgModel.model.blockEvents || drawing) return;

    svgModel.model.blockEvents = true;
    drawing = true;

    createDummyAnnotation(event);

    if (!dummyAnnotation) {
      console.warn("no character found");
      return;
    }

    sendEvent1(
      {
        model: svgModel.model,
        annotation: {
          annotationUuid: dummyAnnotation?.id || "",
        },
      },
      { event: "annotation-create--start" },
      { annotation: dummyAnnotation },
    );
  });

  svg.on("mousemove", (event) => {
    if (!drawing) return;

    createDummyAnnotation(event);
    sendEvent1(
      {
        model: svgModel.model,
        annotation: {
          annotationUuid: dummyAnnotation?.id || "",
        },
      },
      { event: "annotation-create--move" },
      { annotation: dummyAnnotation },
    );
  });

  svg.on("mouseup", () => {
    if (!drawing) return;

    drawing = false;
    svgModel.model.blockEvents = false;
    removeDummyAnnotation(svgModel);

    if (!dummyAnnotation) {
      Debugger.warn("no dummy annotation found, canceling");
      return;
    }

    sendEvent1(
      {
        model: svgModel.model,
        annotation: {
          annotationUuid: dummyAnnotation?.id || "",
        },
      },
      { event: "annotation-create--end" },
      { annotation: dummyAnnotation },
    );
  });
};
