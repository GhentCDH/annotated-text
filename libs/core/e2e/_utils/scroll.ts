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
