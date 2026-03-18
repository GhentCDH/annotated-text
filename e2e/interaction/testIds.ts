export const crudIds = {
  default: 'crud--default',
  edit: 'crud--edit',
  create: 'crud--create',
  'create-edit': 'crud--create-edit',
  'create-edit-tags': 'crud--create-edit-tags',
  'offset-1': 'crud--offset-1-crud',
  'offset-0': 'crud--offset-0-crud',
  'offset-10': 'crud--offset-10-crud',
  'offset--10': 'crud--offset--10-crud',
  actions: 'crud--with-actions',
};

export type CrudIdKeys = keyof typeof crudIds;
export const SnapperIds = {
  default: 'snapper--default',
  wordSnapper: 'snapper--word-snapper',
};

export type SnapperIdKeys = keyof typeof SnapperIds;
