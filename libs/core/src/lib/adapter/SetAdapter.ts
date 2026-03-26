import { TextAdapter, type TextAdapterParams } from './text/TextAdapter';
import { type AnnotationModule } from '../di/annotation.module';
import { AnnotationAdapter, type AnnotationAdapterParams } from '../adapter/annotation';
import { type Snapper } from '../adapter/snapper';

export const setTextAdapter = (
  annotationModule: AnnotationModule,
  adapterOrParams: TextAdapter | TextAdapterParams,
) => {
  if (
    adapterOrParams instanceof TextAdapter ||
    (adapterOrParams as any).TYPE === 'TextAdapter'
  ) {
    annotationModule.updateTextAdapter(adapterOrParams as TextAdapter);

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
    annotationModule.updateAnnotationAdapter(adapterOrParams);

    return adapterOrParams;
  }

  const original = annotationModule.getAnnotationAdapter();
  original.setParams(adapterOrParams);

  return original;
};

export const setSnapperAdapter = (
  annotationModule: AnnotationModule,
  snapper: Snapper,
) => {
  const text = annotationModule.getTextAdapter().fullFlatText;
  annotationModule.updateSnapper(snapper);
  const annotationAdapter = annotationModule.getAnnotationAdapter();
  snapper.setText(text, annotationAdapter.startOffset);

  return snapper;
};
