import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { getLogDivId } from './render-demo';

export const getLog = (page: Page, id: string) => {
  const log = page.locator(`#${getLogDivId(id)}`);

  return {
    expect: async (msg: string) => expect(await log.innerText()).toEqual(msg),
  };
};
