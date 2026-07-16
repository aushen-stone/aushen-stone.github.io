import { expect, test } from "@playwright/test";

test("admin demo renders content management and opens the product editor", async ({ page }) => {
  await page.goto("/admin/?demo=1");

  await expect(page).toHaveTitle(/Admin/);
  await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  await expect(page.getByText("Grey Apricot Marble")).toBeVisible();
  await expect(page.getByRole("button", { name: "Publish site" })).toBeVisible();

  await page.getByRole("button", { name: "Add product" }).click();
  await expect(page.getByRole("heading", { name: "Add product" })).toBeVisible();
  await expect(page.getByText("Product photo", { exact: true })).toBeVisible();
  await expect(page.getByText("Application photos", { exact: true })).toBeVisible();
  await expect(page.getByText("Upload application photos", { exact: true })).toBeVisible();
  await page.getByLabel("Name / title").fill("New Test Stone");
  await expect(page.getByLabel("Slug")).toHaveValue("new-test-stone");
  await page.getByLabel("Material").fill("Marble");
  await expect(page.getByRole("heading", { name: "Product specifications" })).toBeVisible();
  await page.getByRole("button", { name: "Application", exact: true }).click();
  await page.getByLabel("Application name").fill("Pool Coping / Drop Face");
  await page.getByLabel("Product filter category").selectOption("pool-coping");
  await page.getByLabel("Surface finish").fill("Sandblasted");
  await page.getByLabel("Slip rating (optional)").fill("P5");
  await page.getByPlaceholder("e.g. 600x400x20mm").fill("600x400x20/60mm");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Demo saved locally.", { exact: false })).toBeVisible();
  await expect(page.getByText("New Test Stone")).toBeVisible();
  await page.getByRole("button", { name: "Edit New Test Stone" }).click();
  await expect(page.getByLabel("Application name")).toHaveValue("Pool Coping / Drop Face");
  await expect(page.getByLabel("Surface finish")).toHaveValue("Sandblasted");
  await expect(page.getByPlaceholder("e.g. 600x400x20mm")).toHaveValue("600x400x20/60mm");
  await page.getByRole("button", { name: "Close editor" }).click();
  await expect(page.getByRole("heading", { name: "Add product" })).toHaveCount(0);
});

test("admin demo keeps product and blog navigation available on mobile", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile-only interaction");
  await page.goto("/admin/?demo=1");

  await page.getByRole("button", { name: "Blog", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
  await expect(page.getByText("Choosing Stone for Outdoor Spaces")).toBeVisible();
  await page.getByRole("button", { name: "Products", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
});

test("admin blog editor loads legacy HTML and previews visual edits", async ({ page }) => {
  await page.goto("/admin/?demo=1");
  await page.getByRole("button", { name: "Blog", exact: true }).click();
  await page.getByRole("button", { name: "Edit Choosing Stone for Outdoor Spaces" }).click();

  await expect(page.getByText("Article content", { exact: true })).toBeVisible();
  const article = page.locator('[contenteditable="true"][aria-label="Article content"]');
  await expect(article).toContainText("A practical material guide.");
  await article.fill("A practical material guide. Updated visually.");

  await page.getByRole("button", { name: "Preview", exact: true }).click();
  await expect(page.getByText("Updated visually.", { exact: false })).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit", exact: true })).toBeVisible();
});

test("admin demo exposes projects and managed pages", async ({ page }) => {
  await page.goto("/admin/?demo=1");
  await page.getByRole("button", { name: "Projects", exact: true }).first().click();
  await expect(page.getByText("Brighton Residence")).toBeVisible();
  await page.getByRole("button", { name: "Home", exact: true }).first().click();
  await expect(page.getByRole("button", { name: "Edit page" })).toBeVisible();
  await page.getByRole("button", { name: "Edit page" }).click();
  await expect(page.getByText("Advanced JSON")).toBeVisible();
});
