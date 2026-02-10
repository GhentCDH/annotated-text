import { TextAdapter, type TextAdapterParams } from './text/TextAdapter';
import { type AnnotationModule } from '../di/annotation.module';
import { TextAdapterToken } from '../di/tokens';

export const setTextAdapter = (
  annotationModule: AnnotationModule,
  adapterOrParams: TextAdapter | TextAdapterParams,
) => {
  if (adapterOrParams instanceof TextAdapter) {
    adapterOrParams.setModule(annotationModule);
    annotationModule.register(TextAdapterToken, () => adapterOrParams);

    return adapterOrParams;
  }

  const original = annotationModule.inject(TextAdapterToken) as TextAdapter;
  original.setParams(adapterOrParams);

  return original;
};
