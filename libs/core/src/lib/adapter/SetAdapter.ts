import { TextAdapter, type TextAdapterParams } from './text/TextAdapter';
import { type AnnotationModule } from '../di/annotation.module';
import {
  AnnotationAdapter,
  type AnnotationAdapterParams,
} from '../adapter/annotation';

export const setTextAdapter = (
  annotationModule: AnnotationModule,
  adapterOrParams: TextAdapter | TextAdapterParams,
) => {
  if (adapterOrParams instanceof TextAdapter) {
    adapterOrParams.setModule(annotationModule);
    annotationModule.updateTextAdapter(() => adapterOrParams);

    return adapterOrParams;
  }

  const original = annotationModule.getTextAdapter();
  original.setParams(adapterOrParams);

  return original;
};

export const setAnnotationAdapter = (
  annotationModule: AnnotationModule,
  adapterOrParams: AnnotationAdapter<any> | AnnotationAdapterParams,
) => {
  if (adapterOrParams instanceof AnnotationAdapter) {
    adapterOrParams.setModule(annotationModule);
    annotationModule.updateAnnotationAdapter(() => adapterOrParams);

    return adapterOrParams;
  }

  const original = annotationModule.getAnnotationAdapter();
  original.setParams(adapterOrParams);

  return original;
};
