import { test, expect } from "@playwright/test";

test.describe("Reminders", () => {
  test("has correct title", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Reminders")).toBeVisible();
  });

  test("has initial reminders", async ({ page }) => {
    await page.goto("/");

    // Make sure the list has the initial reminder items
    await expect(page.getByText("Write self reflection")).toBeVisible();
    await expect(page.getByText("Fix that bug")).toBeVisible();
  });

  test("updates correctly when adding reminder", async ({ page }) => {
    await page.goto("/");

    // Make sure the list has the initial reminder items
    await expect(page.getByText("Write self reflection")).toBeVisible();
    await expect(page.getByText("Fix that bug")).toBeVisible();

    // Submit a new reminder
    await page.getByLabel("Remind me to").fill("Paint house");
    await page.getByLabel("Remind me to").press("Enter");

    // Check that it shows all the reminders in the list
    await expect(page.getByText("Write self reflection")).toBeVisible();
    await expect(page.getByText("Fix that bug")).toBeVisible();
    await expect(page.getByText("Paint house")).toBeVisible();
  });
});
