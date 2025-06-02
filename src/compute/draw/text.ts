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

const createText = (textLine: TextLine) => {
  const textDiv = document.createElement("div");
  textDiv.className = styles.line.text.wrapper;
  textDiv.innerText = `${textLine.text}`;
  textDiv.setAttribute("data-line-uid", textLine.uuid);

  return textDiv;
};

export const drawText = (textAnnotationModel: TextAnnotationModel) => {
  const { text, gutter } = textAnnotationModel.config;
  const gutterWidth = gutter.width + gutter.gap;
  const gutterPaddingLeft = gutterWidth * textAnnotationModel.maxGutterWeight;

  const linePadding = text.padding * textAnnotationModel.maxLineWeight;
  const textDiv = document.createElement("div");
  textDiv.className = styles.text;

  const lineHeight = linePadding + text.lineHeight + text.padding;

  textDiv.style.setProperty("--gutter-left", `${gutterPaddingLeft}px`);
  textDiv.style.setProperty("--line-padding", `${linePadding}px`);
  textDiv.style.setProperty("--line-height", `${lineHeight}px`);

  textAnnotationModel.lines.forEach((line) => {
    textDiv.appendChild(createGutter(line));
    textDiv.appendChild(createText(line));
  });

  return textDiv;
};
