import {
  clearAnnotatedTextCache,
  createAnnotatedText,
  TextLineAdapter,
} from '@ghentcdh/annotated-text';
import { greekText } from '../data';

export const editAndCreateDemo = (id: string) => {
  clearAnnotatedTextCache();
  createAnnotatedText(id)
    .setTextAdapter(TextLineAdapter())
    .setAnnotationAdapter({ edit: true, create: true })
    .setRenderParams(greekText.renderParams)
    .setStyleParams(greekText.styleParams)
    .setText(greekText.text)
    .setAnnotations(greekText.annotations)
    .on('annotation-edit--start', (e) => console.log('EDIT -- start', e))
    .on('annotation-edit--move', (e) => console.log('EDIT -- move', e))
    .on('annotation-edit--end', (e) => console.log('EDIT -- end', e))
    .on('annotation-create--start', (e) => console.log('CREATE -- start', e))
    .on('annotation-create--move', (e) => console.log('CREATE -- move', e))
    .on('annotation-create--end', (e) => console.log('CREATE -- end', e));
};
