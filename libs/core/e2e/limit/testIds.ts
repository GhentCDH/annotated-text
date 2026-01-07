export const limitIds = {
  'limit-after-init': 'limit-after-init',
  'limit-after-init-ignore-lines': 'limit-after-init-ignore-lines',
  'no-limit': 'no-limit',
};

export type LimitIdKeys = keyof typeof limitIds;
export const annotations = [
  { id: '1', start: 0, end: 8 },
  { id: '2', start: 9, end: 15 },
  { id: '3', start: 38, end: 59 },
  { id: '4', start: 90, end: 94 },
];

annotations.forEach((a) => {
  limitIds[`ignore-lines-${a.id}`] = `ignore-lines-${a.id}`;
  limitIds[`no-ignore-lines-${a.id}`] = `no-ignore-lines-${a.id}`;
});

export const text = `1. Hello world. This is a simple text example.
2. This text has some annotations.
3. Some more lines`;
