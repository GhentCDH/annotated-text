import { test, expect } from '@playwright/experimental-ct-vue';
import AnnotatedTextV2 from './AnnotatedTextV2.vue';

test.describe('AnnotatedTextV2', () => {
  test('renders with basic text', async ({ mount }) => {
    const component = await mount(AnnotatedTextV2, {
      props: {
        text: 'Hello world',
        annotations: [],
      },
    });

    await expect(component).toBeVisible();
    await expect(component).toContainText('Hello world');
  });

  test('renders with annotations', async ({ mount, page }) => {
    const component = await mount(AnnotatedTextV2, {
      props: {
        text: 'Hello world',
        annotations: [
          { id: '1', start: 0, end: 5 },
        ],
      },
    });

    await expect(component).toBeVisible();
    await expect(component).toContainText('Hello world');
    
    // Annotations are rendered as SVG with data-annotation-uid
    const annotation = page.locator('[data-annotation-uid="1"]');
    await expect(annotation.first()).toBeVisible();
  });

  test('renders RTL text', async ({ mount }) => {
    const component = await mount(AnnotatedTextV2, {
      props: {
        text: 'مرحبا بالعالم',
        annotations: [],
        rtl: true,
      },
    });

    await expect(component).toBeVisible();
  });

  test('emits event on annotation click', async ({ mount, page }) => {
    const events: unknown[] = [];

    const component = await mount(AnnotatedTextV2, {
      props: {
        text: 'Hello world',
        annotations: [
          { id: '1', start: 0, end: 5 },
        ],
      },
      on: {
        event: (...args) => events.push(args),
      },
    });

    await expect(component).toBeVisible();
    
    // Click on the annotation fill
    const annotation = page.locator('[data-annotation-uid="1"][data-annotation-role="fill"]').first();
    await annotation.click();
    
    expect(events.length).toBeGreaterThan(0);
  });

  test('handles selected annotations', async ({ mount, page }) => {
    const component = await mount(AnnotatedTextV2, {
      props: {
        text: 'Hello world',
        annotations: [
          { id: '1', start: 0, end: 5 },
          { id: '2', start: 6, end: 11 },
        ],
        selectedAnnotations: ['1'],
      },
    });

    await expect(component).toBeVisible();
    
    // Both annotations should be rendered
    await expect(page.locator('[data-annotation-uid="1"]').first()).toBeVisible();
    await expect(page.locator('[data-annotation-uid="2"]').first()).toBeVisible();
  });

  test('handles highlighted annotations', async ({ mount, page }) => {
    const component = await mount(AnnotatedTextV2, {
      props: {
        text: 'Hello world',
        annotations: [
          { id: '1', start: 0, end: 5 },
        ],
        highlightAnnotations: ['1'],
      },
    });

    await expect(component).toBeVisible();
    await expect(page.locator('[data-annotation-uid="1"]').first()).toBeVisible();
  });
});
