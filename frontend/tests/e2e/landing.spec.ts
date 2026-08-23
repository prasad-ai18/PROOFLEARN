import { test, expect } from "@playwright/test";

test.describe("Landing Page & Design System", () => {
  test("should render brand tagline and core philosophy", async ({ page }) => {
    await page.goto("/");

    // Verify main brand name and tagline
    await expect(page.locator("text=PROOFLEARN").first()).toBeVisible();
    await expect(
      page.locator("text=Don't just get the answer. Prove you learned it.").first()
    ).toBeVisible();

    // Verify navigation links
    await expect(page.locator("text=Explore Curriculum").first()).toBeVisible();
    await expect(page.locator("text=Sign In").first()).toBeVisible();
  });

  test("should display design system showcase primitives", async ({ page }) => {
    await page.goto("/");

    // Check design system sections
    await expect(page.locator("text=Colors & Tokens").first()).toBeVisible();
    await expect(page.locator("text=Buttons").first()).toBeVisible();
    await expect(page.locator("text=Cards & Panels").first()).toBeVisible();
  });
});
