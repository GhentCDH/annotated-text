import memoize from "memoizee";
import { Debugger } from "../../../utils/debugger";
import {
  AnnotationAdapter,
  TextAdapter,
  TextDirection,
} from "../../../adapter";
import { TextAnnotationModel } from "../../annotation.model";
import { type TextLine } from "../../../model";
import { styles } from "../../styles.const";

const document = globalThis.document || null;

const createGutter = (textLine: TextLine, text: TextAdapter) => {
  const gutterDiv = document?.createElement("div");
  // gutterDiv.style.padding = `0 0 0 ${gutterPaddingLeft} px`;

  // pass gutter-weight css variable
  const { lineHeight } = calculateLinePadding(
    text.style.padding,
    textLine.maxLineWeight,
    text.style.lineHeight,
  );

  gutterDiv.style.setProperty("--gutter--line-height", `${lineHeight}px`);

  gutterDiv.className = styles.line.gutter.wrapper;
  // TODO define width on max annotations
  gutterDiv.innerHTML = textLine.gutter ?? "";
  gutterDiv.setAttribute("data-gutter-uid", textLine.uuid);

  return gutterDiv;
};

const calculateLinePadding = memoize(
  (padding: number, maxLineWeight: number, textLineHeight: number) => {
    const linePadding = padding * maxLineWeight;
    const lineHeight = linePadding + textLineHeight + padding * 2;
    return { linePadding, lineHeight };
  },
);

const createText = (
  textLine: TextLine,
  textDirection: TextDirection,
  textAdapter: TextAdapter,
) => {
  const textDiv = document.createElement("div");

  const { linePadding, lineHeight } = calculateLinePadding(
    textAdapter.style.padding,
    textLine.maxLineWeight,
    textAdapter.style.lineHeight,
  );

  textDiv.style.setProperty("--line-padding", `${linePadding}px`);
  textDiv.style.setProperty("--line-height", `${lineHeight}px`);

  textDiv.className = `${styles.line.text.wrapper} ${textDirection}`;
  textDiv.innerHTML = textAdapter?.flatText ? textLine.flatText : textLine.html;
  textDiv.setAttribute("data-line-uid", textLine.uuid);
  textDiv.setAttribute("data-annotation-role", "line");

  return textDiv;
};

export const drawText = (
  textAnnotationModel: TextAnnotationModel,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => {
  if (!document) {
    Debugger.debug("no document available, cannot draw text");
    return;
  }

  const gutterPaddingLeft = textAnnotationModel.gutterModel.gutterPaddingLeft(
    annotationAdapter.renderInstance,
  );

  const textDiv = document?.createElement("div");
  textDiv.className = `${styles.text} `;

  textDiv.style.setProperty("--gutter-left", `${gutterPaddingLeft}px`);

  Debugger.verbose("Draw the lines", textAnnotationModel.lines.length);
  textAnnotationModel.lines.forEach((line) => {
    textDiv.appendChild(createGutter(line, textAdapter));
    textDiv.appendChild(
      createText(line, textAnnotationModel.textDirection, textAdapter),
    );
  });

  return textDiv as HTMLDivElement;
};
