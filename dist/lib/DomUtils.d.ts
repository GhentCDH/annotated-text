declare const createPositionFromPoint: (x: number, y: number) => {
    offsetNode: Node;
    offset: number;
    getClientRect(): ClientRect | DOMRect;
} | null;
export { createPositionFromPoint };
