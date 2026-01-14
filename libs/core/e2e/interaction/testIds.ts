export const crudIds = {
  default: 'default-crud',
  edit: 'edit-crud',
  create: 'create-crud',
  'create-edit': 'create-edit-crud',
  'create-edit-tags': 'create-edit-crud-tags',
  'offset-1': 'offset-1-crud',
  'offset-0': 'offset-0-crud',
  'offset-10': 'offset-10-crud',
  'offset--10': 'offset--10-crud',
};

export type CrudIdKeys = keyof typeof crudIds;
