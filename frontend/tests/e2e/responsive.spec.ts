import { test, expect } from "@playwright/test";

test.describe("Responsive Layouts & Viewports", () => {
  test("should render cleanly on mobile viewport (375x667)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    await expect(page.locator("text=PROOFLEARN").first()).toBeVisible();
    await expect(page.locator("text=Explore Curriculum").first()).toBeVisible();
  });

  test("should render cleanly on tablet viewport (768x1024)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");

    await expect(page.locator("text=PROOFLEARN").first()).toBeVisible();
  });

  test("should render cleanly on desktop viewport (1280x800)", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await expect(page.locator("text=PROOFLEARN").first()).toBeVisible();
  });
});
