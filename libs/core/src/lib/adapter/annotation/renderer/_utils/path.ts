import { type AnnotationDrawPath } from '../../../../model';

export type PathParams = {
  x: number;
  y: number;
  width: number;
  height: number;
  r: number;
  leftBorder: boolean;
  rightBorder: boolean;
};

export type createAnnotationPathFn = (params: PathParams) => AnnotationDrawPath;
