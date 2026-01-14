import { expect, type Locator, type Page } from '@playwright/test';
import { scrollTo } from './scroll';
import { type Position } from '../../src/lib/compute/draw/types';

export class MouseMove {
  private startX = 0;
  private startY = 0;

  constructor(
    private readonly page: Page,
    private readonly container: Locator,
  ) {}

  private get boundingBox() {
    const boundingBox = this.container.boundingBox()!;
    expect(boundingBox).not.toBeNull();

    return boundingBox;
  }

  async onMouseDown(position: Position) {
    // Scroll the specific position into view
    await scrollTo(this.container, position);

    await this.page.waitForTimeout(100);

    const boundingBox = await this.boundingBox;

    // Calculate positions within the text area
    this.startX = boundingBox.x + position.x;
    this.startY = boundingBox.y + position.y;

    // ============================================
    // Step 1: Click on position (mousedown)
    // ============================================
    await this.page.mouse.move(this.startX, this.startY);
    await this.page.mouse.down();
    // await this.page.mouse.move(this.startX + 20, this.startY);

    // Wait for annotation-create--start event
    await this.page.waitForTimeout(100);

    return this;
  }

  async onMouseDrag(position: Position, moveSteps = 1) {
    const boundingBox = await this.boundingBox;

    const endX = boundingBox.x + position.x;
    const endY = boundingBox.y + position.y;

    const stepX = (endX - this.startX) / moveSteps;
    const stepY = (endY - this.startY) / moveSteps;

    for (let i = 1; i <= moveSteps; i++) {
      const currentX = this.startX + stepX * i;
      const currentY = this.startY + stepY * i;
      await this.page.mouse.move(currentX, currentY);
      await this.page.waitForTimeout(50);
    }
    return this;
  }

  async onMouseMoveTo(position: Position) {
    const boundingBox = await this.boundingBox;

    const endX = boundingBox.x + position.x;
    const endY = boundingBox.y + position.y;

    await this.page.mouse.move(endX, endY);
    await this.page.waitForTimeout(50);

    return this;
  }

  async onMouseEnd() {
    await this.page.mouse.up();
    await this.page.waitForTimeout(100);
    await this.page.mouse.move(0, 0);
    // Move mouse out of view
    return this;
  }
}
