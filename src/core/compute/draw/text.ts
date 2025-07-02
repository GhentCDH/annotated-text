import memoize from "memoizee";
import { TextAdapter, TextDirection } from "../../adapter/text";
import { AnnotationAdapter } from "../../adapter/annotation";
import { TextAnnotationModel } from "../annotation.model";
import { type TextLine } from "../../model";
import { styles } from "../styles.const";

const document = globalThis.document || null;

const createGutter = (textLine: TextLine) => {
  const gutterDiv = document?.createElement("div");
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
  textDirection: TextDirection,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => {
  const textDiv = document.createElement("div");

  const { text } = annotationAdapter.config;
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
  if (!document) return;
  const { gutter } = annotationAdapter.config;
  const gutterWidth = gutter.width + gutter.gap;
  const gutterPaddingLeft = gutterWidth * textAnnotationModel.maxGutterWeight;

  const textDiv = document?.createElement("div");
  textDiv.className = `${styles.text} `;

  textDiv.style.setProperty("--gutter-left", `${gutterPaddingLeft}px`);

  textAnnotationModel.lines.forEach((line) => {
    textDiv.appendChild(createGutter(line));
    textDiv.appendChild(
      createText(
        line,
        textAnnotationModel.textDirection,
        textAdapter,
        annotationAdapter,
      ),
    );
  });

  return textDiv;
};
