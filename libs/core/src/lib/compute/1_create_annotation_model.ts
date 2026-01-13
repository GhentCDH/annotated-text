import { getLineHeight } from './draw/utils/line-height';
import { type AnnotationAdapter } from '../adapter';
import { type TextAdapter } from '../adapter/text';
import { Debugger } from '../utils/debugger';

export const createAnnotationModel = (
  text: string,
  textAdapter: TextAdapter,
  annotationAdapter: AnnotationAdapter<any>,
) => {
  Debugger.debug('LineAdapter', textAdapter.name);

  // 1. first parse the text into lines
  const lines = textAdapter.parse(text);

  // 2. set the lines on the text adapter
  textAdapter.setLines(lines);

  annotationAdapter.setText(text, textAdapter.textOffset);
  textAdapter.setLineHeight(getLineHeight(text, textAdapter.style.lineOffset));
};
