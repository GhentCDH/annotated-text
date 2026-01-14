import { type Locator } from '@playwright/test';

export const scrollTo = (
  container: Locator,
  position: { x: number; y: number },
) => {
  return container.evaluate((el, pos) => {
    const rect = el.getBoundingClientRect();
    const targetY = rect.top + pos.y;
    const targetX = rect.left + pos.x;

    // Scroll so the target position is centered in viewport
    window.scrollTo({
      top: window.scrollY + targetY - window.innerHeight / 2,
      left: window.scrollX + targetX - window.innerWidth / 2,
      behavior: 'instant',
    });
  }, position);
};
export const getPositionRelativeTo = async (
  mainContainer: Locator,
  container: Locator,
) => {
  const mainPos = await mainContainer.boundingBox()!;
  const innerPos = await container.boundingBox()!;

  const startX = innerPos.x - mainPos.x;
  const startY = innerPos.y - mainPos.y;
  const endY = startY + innerPos.height;
  const endX = startX + innerPos.width;
  return {
    startX: startX + 2,
    startY,
    endY,
    endX: endX - 4,
    middleX: startX + innerPos.width / 2,
    middleY: startY + innerPos.height / 2,
  };
};
