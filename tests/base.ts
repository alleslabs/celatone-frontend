import { test as baseTest } from "@playwright/test";

import { setFakeDateTime } from "./utils/faketime";

export const test = baseTest.extend({
  page: async ({ page }, use) => {
    await setFakeDateTime(page, "2024-02-20T00:00:00.000Z");

    await use(page);
  },
});

export const { expect } = test;
