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
import { TextSettings } from "../../model/text.cache.model";

const document = globalThis.document || null;

const createGutter = (textLine: TextLine, text: TextSettings) => {
  const gutterDiv = document?.createElement("div");
  // gutterDiv.style.padding = `0 0 0 ${gutterPaddingLeft} px`;

  // pass gutter-weight css variable
  const { lineHeight } = calculateLinePadding(
    text.padding,
    textLine.maxLineWeight,
    text.lineHeight,
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
  text: TextSettings,
) => {
  const textDiv = document.createElement("div");

  const { linePadding, lineHeight } = calculateLinePadding(
    text.padding,
    textLine.maxLineWeight,
    text.lineHeight,
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

  Debugger.debug("Draw the lines", textAnnotationModel.lines.length);
  const textSettings = textAnnotationModel.annotationTextModel.getTextSettings(
    annotationAdapter.renderInstance,
  );
  textAnnotationModel.lines.forEach((line) => {
    textDiv.appendChild(createGutter(line, textSettings));
    textDiv.appendChild(
      createText(
        line,
        textAnnotationModel.textDirection,
        textAdapter,
        textSettings,
      ),
    );
  });

  return textDiv as HTMLDivElement;
};
