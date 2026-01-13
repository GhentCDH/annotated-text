const text = `The quick brown fox jumps over the lazy dog near the riverbank at dawn.
Second line.`;

const annotations = [
  {
    id: 'demo-short-text-1',
    start: 4,
    end: 9,
    label: 'adjective',
    color: '#fbbf24',
    positionScreen: {
      startX: 50,
      startY: 15,
      endX: 90,
      endY: 15,
    },
  },
  {
    id: 'demo-short-text-2',
    start: 10,
    end: 15,
    label: 'adjective',
    color: '#34d399',
  },
  {
    id: 'demo-short-text-3',
    start: 16,
    end: 19,
    label: 'noun',
    color: '#60a5fa',
  },
  {
    id: 'demo-short-text-4',
    start: 1,
    end: 19,
    label: 'noun',
    color: '#60a5fa',
    renderer: 'gutter',
  },
];

export const DemoShortText = { text, annotations };
