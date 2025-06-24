export type AnnotationAdapter = {
  name: string;
};

export class DefaultAnnotationAdapterImpl implements AnnotationAdapter {
  name = "DefaultAnnotationAdapter";
}

export const DefaultAnnotationAdapter = (): AnnotationAdapter => {
  return new DefaultAnnotationAdapterImpl();
};
