import { test, expect } from "@playwright/test";

test.describe("Protected Navigation & Auth Boundary", () => {
  test("should redirect unauthenticated user from /learn to sign-in", async ({ page }) => {
    await page.goto("/learn");
    await expect(page).toHaveURL(/.*\/auth\/sign-in/);
  });

  test("should redirect unauthenticated user from /history to sign-in", async ({ page }) => {
    await page.goto("/history");
    await expect(page).toHaveURL(/.*\/auth\/sign-in/);
  });

  test("should render sign-in page with Google OAuth button", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await expect(page.locator("text=Sign In with Google")).toBeVisible();
    await expect(page.locator("text=Single Sign-On")).toBeVisible();
  });
});
