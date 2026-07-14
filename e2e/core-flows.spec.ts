import { expect, test } from "@playwright/test";

test("homepage renders its primary conversion paths", async ({
  page,
}) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));

  await page.goto("/");

  await expect(page).toHaveTitle(/Aushen Stone/);
  await expect(
    page.getByRole("heading", { name: /Find your crafted architectural surfaces/i })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Talk to a Stone Specialist" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Browse Products" })).toBeVisible();

  // GTM can load third-party scripts on GitHub's runner (while local sandbox
  // networking blocks them). Ignore its known DOM mutation error and continue
  // failing on every application-owned page error.
  const applicationErrors = pageErrors.filter(
    (error) => !/Cannot set properties of null \(setting 'value'\)/.test(error.message)
  );
  expect(applicationErrors).toEqual([]);
});

test("product search updates the shareable URL and rendered results", async ({ page }) => {
  await page.goto("/products/");

  const search = page.getByRole("textbox", {
    name: "Search products by name or material",
  });
  await search.fill("BlueOcean");

  await expect(page).toHaveURL(/q=BlueOcean/);
  await expect(page.getByText("Filters applied")).toBeVisible();
  await expect(page.locator('a[id^="product-"]')).toHaveCount(2);

  await page.getByRole("button", { name: "Clear Filters" }).click();
  await expect(page).not.toHaveURL(/q=/);
  await expect(page.getByText("No filters applied")).toBeVisible();
});

test("mobile navigation opens and exposes the primary sections", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile-only interaction");
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Toggle navigation menu" });
  await toggle.click();

  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("link", { name: "Products", exact: true }).last()).toBeVisible();
  await expect(page.getByRole("link", { name: "Contact", exact: true }).last()).toBeVisible();
});
