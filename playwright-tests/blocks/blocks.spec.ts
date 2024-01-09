import { expect, test } from "../base";
import { mockBlocksResponse } from "../mocks";

test("should render blocks and compare snapshot", async ({ page }) => {
  await page.route(/\/v1\/osmosis\/osmosis-1\/blocks/, async (route) => {
    await route.fulfill({ json: mockBlocksResponse });
  });

  await page.goto("/blocks");

  await expect.soft(page.getByText("13151707")).toBeVisible();
  await expect.soft(page.getByText("6F99E1...560C3B")).toBeVisible();
  await expect.soft(page.getByRole("img", { name: "Larry" })).toBeVisible();
  await expect.soft(page).toHaveScreenshot();
});
