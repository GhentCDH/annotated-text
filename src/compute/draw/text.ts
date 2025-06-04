import memoize from "memoizee";
import { TextAnnotationModel, TextLine } from "../annotation.model";
import { styles } from "../styles.const";

const createGutter = (textLine: TextLine) => {
  const gutterDiv = document.createElement("div");
  // gutterDiv.style.padding = `0 0 0 ${gutterPaddingLeft} px`;

  // pass gutter-weight css variable

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
  textAnnotationModel: TextAnnotationModel,
) => {
  const textDiv = document.createElement("div");

  const { text } = textAnnotationModel.config;
  const { linePadding, lineHeight } = calculateLinePadding(
    text.padding,
    textLine.maxLineWeight,
    text.lineHeight,
  );

  textDiv.style.setProperty("--line-padding", `${linePadding}px`);
  textDiv.style.setProperty("--line-height", `${lineHeight}px`);

  textDiv.className = styles.line.text.wrapper;
  textDiv.innerText = `${textLine.text}`;
  textDiv.setAttribute("data-line-uid", textLine.uuid);
  textDiv.setAttribute("data-annotation-role", "line");

  return textDiv;
};

export const drawText = (textAnnotationModel: TextAnnotationModel) => {
  const { gutter } = textAnnotationModel.config;
  const gutterWidth = gutter.width + gutter.gap;
  const gutterPaddingLeft = gutterWidth * textAnnotationModel.maxGutterWeight;

  const textDiv = document.createElement("div");
  textDiv.className = styles.text;

  textDiv.style.setProperty("--gutter-left", `${gutterPaddingLeft}px`);

  textAnnotationModel.lines.forEach((line) => {
    textDiv.appendChild(createGutter(line));
    textDiv.appendChild(createText(line, textAnnotationModel));
  });

  return textDiv;
};
