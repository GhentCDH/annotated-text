import { TextAdapter, type TextAdapterParams } from './text/TextAdapter';
import { type AnnotationModule } from '../di/annotation.module';
import { AnnotationAdapterToken, TextAdapterToken } from '../di/tokens';
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
    annotationModule.updateAdapter(TextAdapterToken, () => adapterOrParams);

    return adapterOrParams;
  }

  const original = annotationModule.inject(TextAdapterToken) as TextAdapter;
  original.setParams(adapterOrParams);

  return original;
};

export const setAnnotationAdapter = (
  annotationModule: AnnotationModule,
  adapterOrParams: AnnotationAdapter<any> | AnnotationAdapterParams,
) => {
  if (adapterOrParams instanceof AnnotationAdapter) {
    adapterOrParams.setModule(annotationModule);
    annotationModule.updateAdapter(
      AnnotationAdapterToken,
      () => adapterOrParams,
    );

    return adapterOrParams;
  }

  const original = annotationModule.inject(
    AnnotationAdapterToken,
  ) as AnnotationAdapter<any>;
  original.setParams(adapterOrParams);

  return original;
};
