import { beforeEach, describe, expect, it, vi } from 'vitest';
import RBush from 'rbush';
import { drawTextRaster } from '../text-raster';
import { calculateOffset, findLineElement } from '../../utils/bounding-rect';
import { type SvgModel } from '../../../model/svg.types';

// Mock dependencies
vi.mock('rbush');
vi.mock('../../utils/bounding-rect');

// Mock NodeFilter for browser API
global.NodeFilter = {
  SHOW_TEXT: 4,
} as any;

describe('drawTextRaster', () => {
  let mockSvgModel: SvgModel;
  let mockInsert: ReturnType<typeof vi.fn>;
  let mockContainer: HTMLElement;
  let mockTextNode: Text;
  let mockRange: Range;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock RBush instance with insert method
    mockInsert = vi.fn();
    const mockTreeInstance = {
      insert: mockInsert,
    };

    // Mock RBush as a constructor using a proper constructor function
    (RBush as any).mockImplementation(function (this: any) {
      return mockTreeInstance;
    });

    // Mock container element
    mockContainer = {
      getBoundingClientRect: vi.fn().mockReturnValue({
        x: 100,
        y: 50,
        width: 800,
        height: 600,
      } as any),
    } as any;

    // Mock text node
    mockTextNode = {
      textContent: 'Hello',
      parentElement: {} as any,
    } as any;

    // Mock Range
    mockRange = {
      setStart: vi.fn(),
      setEnd: vi.fn(),
      getBoundingClientRect: vi.fn().mockReturnValue({
        x: 150,
        y: 100,
        width: 10,
        height: 16,
      } as any),
    } as any;

    // Mock document methods
    global.document = {
      createTreeWalker: vi.fn(),
      createRange: vi.fn().mockReturnValue(mockRange),
    } as any;

    // Mock utility functions
    vi.mocked(findLineElement).mockReturnValue({
      lineUid: 'line-1',
      lineHeight: 20,
    } as any);
    vi.mocked(calculateOffset).mockReturnValue(2);

    // Mock SvgModel
    mockSvgModel = {
      textElement: mockContainer,
      model: {
        getLine: vi.fn().mockReturnValue({
          start: 0,
          end: 5,
        } as any),
      },
    } as any;
  });

  it('should create and return an RBush tree', () => {
    // Setup walker with no nodes
    const mockWalker = {
      nextNode: vi.fn().mockReturnValue(null),
    };
    vi.mocked(document.createTreeWalker).mockReturnValue(mockWalker as any);

    const result = drawTextRaster(mockSvgModel);

    expect(RBush).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.insert).toBeDefined();
  });

  it('should create tree walker with correct parameters', () => {
    const mockWalker = {
      nextNode: vi.fn().mockReturnValue(null),
    };
    vi.mocked(document.createTreeWalker).mockReturnValue(mockWalker as any);

    drawTextRaster(mockSvgModel);

    expect(document.createTreeWalker).toHaveBeenCalledWith(
      mockContainer,
      NodeFilter.SHOW_TEXT,
      null,
    );
  });

  it('should skip text nodes with no content', () => {
    const emptyTextNode = { textContent: '' } as Text;
    const mockWalker = {
      nextNode: vi
        .fn()
        .mockReturnValueOnce(emptyTextNode)
        .mockReturnValueOnce(null),
    };
    vi.mocked(document.createTreeWalker).mockReturnValue(mockWalker as any);

    drawTextRaster(mockSvgModel);

    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('should skip nodes without lineUid', () => {
    const mockWalker = {
      nextNode: vi
        .fn()
        .mockReturnValueOnce(mockTextNode)
        .mockReturnValueOnce(null),
    };
    vi.mocked(document.createTreeWalker).mockReturnValue(mockWalker as any);
    vi.mocked(findLineElement).mockReturnValueOnce({
      lineUid: null,
      lineHeight: 20,
    } as any);

    drawTextRaster(mockSvgModel);

    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('should skip nodes when line is not found in model', () => {
    const mockWalker = {
      nextNode: vi
        .fn()
        .mockReturnValueOnce(mockTextNode)
        .mockReturnValueOnce(null),
    };
    vi.mocked(document.createTreeWalker).mockReturnValue(mockWalker as any);
    vi.mocked(mockSvgModel.model.getLine).mockReturnValueOnce(null as any);

    drawTextRaster(mockSvgModel);

    expect(mockInsert).not.toHaveBeenCalled();
  });

  it('should insert each character into the tree with correct bounds', () => {
    const textNode = { textContent: 'Hi' } as Text;
    const mockWalker = {
      nextNode: vi.fn().mockReturnValueOnce(textNode).mockReturnValueOnce(null),
    };
    vi.mocked(document.createTreeWalker).mockReturnValue(mockWalker as any);

    drawTextRaster(mockSvgModel);

    // Should be called once for each character
    expect(mockInsert).toHaveBeenCalledTimes(2);

    // Check first character "H"
    expect(mockInsert).toHaveBeenNthCalledWith(1, {
      minX: 50, // 150 - 100 (container x)
      minY: 48, // 100 - 50 (container y) - 2 (offset)
      maxX: 60, // 50 + 10 (width)
      maxY: 68, // 48 + 16 (height) + 4 (offset * 2)
      textPosition: 0,
      centerX: 55, // 50 (minX) + 10 (width) / 2
      text: 'H',
    });

    // Check second character "i"
    expect(mockInsert).toHaveBeenNthCalledWith(2, {
      minX: 50,
      minY: 48,
      maxX: 60,
      maxY: 68,
      textPosition: 1,
      centerX: 55, // 50 (minX) + 10 (width) / 2
      text: 'i',
    });
  });

  it('should create range for each character correctly', () => {
    const textNode = { textContent: 'AB' } as Text;
    const mockWalker = {
      nextNode: vi.fn().mockReturnValueOnce(textNode).mockReturnValueOnce(null),
    };
    vi.mocked(document.createTreeWalker).mockReturnValue(mockWalker as any);

    drawTextRaster(mockSvgModel);

    expect(document.createRange).toHaveBeenCalledTimes(2);
    expect(mockRange.setStart).toHaveBeenCalledWith(textNode, 0);
    expect(mockRange.setEnd).toHaveBeenCalledWith(textNode, 1);
    expect(mockRange.setStart).toHaveBeenCalledWith(textNode, 1);
    expect(mockRange.setEnd).toHaveBeenCalledWith(textNode, 2);
  });

  it('should reset prevEnd when switching to a new line', () => {
    const textNode1 = { textContent: 'ABC' } as Text;
    const textNode2 = { textContent: 'DEF' } as Text;

    const mockWalker = {
      nextNode: vi
        .fn()
        .mockReturnValueOnce(textNode1)
        .mockReturnValueOnce(textNode2)
        .mockReturnValueOnce(null),
    };
    vi.mocked(document.createTreeWalker).mockReturnValue(mockWalker as any);

    // findLineElement is called ONCE per text node (not per character)
    const mockFindLineElement = vi.mocked(findLineElement);
    mockFindLineElement.mockReset();
    mockFindLineElement
      .mockReturnValueOnce({ lineUid: 'line-1', lineHeight: 20 } as any) // For textNode1
      .mockReturnValueOnce({ lineUid: 'line-2', lineHeight: 20 } as any); // For textNode2

    // getLine is called ONCE per text node (not per character)
    const mockGetLine = vi.mocked(mockSvgModel.model.getLine);
    mockGetLine.mockReset();
    mockGetLine
      .mockReturnValueOnce({ start: 0, end: 3 } as any) // For textNode1
      .mockReturnValueOnce({ start: 10, end: 13 } as any); // For textNode2

    drawTextRaster(mockSvgModel);

    // Characters in first line should have positions 0, 1, 2
    // Characters in second line should have positions 10, 11, 12 (not 13, 14, 15)
    const calls = mockInsert.mock.calls;

    expect(calls[0][0].textPosition).toBe(0); // A
    expect(calls[1][0].textPosition).toBe(1); // B
    expect(calls[2][0].textPosition).toBe(2); // C
    expect(calls[3][0].textPosition).toBe(10); // D (reset to line start)
    expect(calls[4][0].textPosition).toBe(11); // E
    expect(calls[5][0].textPosition).toBe(12); // F
  });

  it('should accumulate prevEnd within the same line', () => {
    const textNode1 = { textContent: 'AB' } as Text;
    const textNode2 = { textContent: 'CD' } as Text;

    const mockWalker = {
      nextNode: vi
        .fn()
        .mockReturnValueOnce(textNode1)
        .mockReturnValueOnce(textNode2)
        .mockReturnValueOnce(null),
    };
    vi.mocked(document.createTreeWalker).mockReturnValue(mockWalker as any);

    // Both nodes are in the same line - called once per text node
    const mockFindLineElement = vi.mocked(findLineElement);
    mockFindLineElement.mockReset();
    mockFindLineElement
      .mockReturnValueOnce({ lineUid: 'line-1', lineHeight: 20 } as any) // For textNode1
      .mockReturnValueOnce({ lineUid: 'line-1', lineHeight: 20 } as any); // For textNode2

    const mockGetLine = vi.mocked(mockSvgModel.model.getLine);
    mockGetLine.mockReset();
    mockGetLine
      .mockReturnValueOnce({ start: 0, end: 4 } as any) // For textNode1
      .mockReturnValueOnce({ start: 0, end: 4 } as any); // For textNode2

    drawTextRaster(mockSvgModel);

    const calls = mockInsert.mock.calls;

    expect(calls[0][0].textPosition).toBe(0); // A
    expect(calls[1][0].textPosition).toBe(1); // B
    expect(calls[2][0].textPosition).toBe(2); // C (continued from previous node)
    expect(calls[3][0].textPosition).toBe(3); // D
  });

  it('should call calculateOffset with lineHeight and rect height', () => {
    const textNode = { textContent: 'X' } as Text;
    const mockWalker = {
      nextNode: vi.fn().mockReturnValueOnce(textNode).mockReturnValueOnce(null),
    };
    vi.mocked(document.createTreeWalker).mockReturnValue(mockWalker as any);

    drawTextRaster(mockSvgModel);

    expect(calculateOffset).toHaveBeenCalledWith(20, 16);
  });

  it('should handle multiple lines correctly', () => {
    const textNode1 = { textContent: 'A' } as Text;
    const textNode2 = { textContent: 'B' } as Text;
    const textNode3 = { textContent: 'C' } as Text;

    const mockWalker = {
      nextNode: vi
        .fn()
        .mockReturnValueOnce(textNode1)
        .mockReturnValueOnce(textNode2)
        .mockReturnValueOnce(textNode3)
        .mockReturnValueOnce(null),
    };
    vi.mocked(document.createTreeWalker).mockReturnValue(mockWalker as any);

    // Called once per text node
    const mockFindLineElement = vi.mocked(findLineElement);
    mockFindLineElement.mockReset();
    mockFindLineElement
      .mockReturnValueOnce({ lineUid: 'line-1', lineHeight: 20 } as any) // textNode1
      .mockReturnValueOnce({ lineUid: 'line-1', lineHeight: 20 } as any) // textNode2
      .mockReturnValueOnce({ lineUid: 'line-2', lineHeight: 20 } as any); // textNode3

    const mockGetLine = vi.mocked(mockSvgModel.model.getLine);
    mockGetLine.mockReset();
    mockGetLine
      .mockReturnValueOnce({ start: 0, end: 2 } as any) // textNode1
      .mockReturnValueOnce({ start: 0, end: 2 } as any) // textNode2
      .mockReturnValueOnce({ start: 5, end: 6 } as any); // textNode3

    drawTextRaster(mockSvgModel);

    const calls = mockInsert.mock.calls;

    expect(calls[0][0].textPosition).toBe(0); // A in line-1
    expect(calls[1][0].textPosition).toBe(1); // B in line-1
    expect(calls[2][0].textPosition).toBe(5); // C in line-2
  });
});
