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
  await page.getByRole("button", { name: "Size", exact: true }).click();
  await page
    .getByPlaceholder("e.g. 600x400x20mm")
    .last()
    .fill("800x400x20/60mm");
  await page.getByRole("button", { name: "Surface finish", exact: true }).click();
  await page.getByLabel("Surface finish").last().fill("Honed (P3)");
  await page.getByLabel("Surface finish").last().blur();
  await expect(page.getByLabel("Surface finish").last()).toHaveValue("Honed");
  await expect(page.getByLabel("Slip rating (optional)").last()).toHaveValue("P3");
  await page
    .getByPlaceholder("e.g. 600x400x20mm")
    .last()
    .fill("600x400x20mm");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Demo saved locally.", { exact: false })).toBeVisible();
  await expect(page.getByText("New Test Stone")).toBeVisible();
  await page.getByRole("button", { name: "Edit New Test Stone" }).click();
  await expect(page.getByLabel("Application name")).toHaveValue("Pool Coping / Drop Face");
  await expect(page.getByLabel("Surface finish")).toHaveCount(2);
  await expect(page.getByLabel("Surface finish").first()).toHaveValue("Sandblasted");
  await expect(page.getByLabel("Surface finish").last()).toHaveValue("Honed");
  await expect(page.getByPlaceholder("e.g. 600x400x20mm")).toHaveCount(3);
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

test("product and blog uploads reject unsupported images and restore controls", async ({ page }) => {
  const chooseUnsupportedImage = async (
    input: ReturnType<typeof page.locator>,
    name: string,
  ) => {
    await input.evaluate((element, fileName) => {
      const transfer = new DataTransfer();
      transfer.items.add(new File([new Uint8Array([1, 2, 3])], fileName, { type: "image/heic" }));
      Object.defineProperty(element, "files", {
        configurable: true,
        value: transfer.files,
      });
      element.dispatchEvent(new Event("change", { bubbles: true }));
    }, name);
  };

  await page.goto("/admin/?demo=1");
  await page.getByRole("button", { name: "Add product" }).click();

  const productPhotoInput = page
    .locator("label")
    .filter({ hasText: "Upload product photo" })
    .locator('input[type="file"]');
  // Dispatch directly so the test can exercise the validation path even though
  // Chromium correctly filters HEIC out of the native file chooser via `accept`.
  await chooseUnsupportedImage(productPhotoInput, "lime-greige.heic");
  await expect(
    page.getByText(
      "lime-greige.heic is not supported. Use JPEG, PNG, WebP or AVIF.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByText("Upload product photo", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Close editor" }).click();
  await page.getByRole("button", { name: "Blog", exact: true }).click();
  await page.getByRole("button", { name: "Edit Choosing Stone for Outdoor Spaces" }).click();
  const blogHeroInput = page
    .locator("label")
    .filter({ hasText: "Upload image" })
    .locator('input[type="file"]');
  await chooseUnsupportedImage(blogHeroInput, "blog-hero.heic");
  await expect(
    page.getByText("blog-hero.heic is not supported. Use JPEG, PNG, WebP or AVIF.", {
      exact: true,
    }),
  ).toBeVisible();
  const articleImageInput = page
    .locator("label")
    .filter({ hasText: /^Image$/ })
    .locator('input[type="file"]');
  await chooseUnsupportedImage(articleImageInput, "article-image.heic");
  await expect(
    page.getByRole("alert").filter({ hasText: "article-image.heic is not supported" }),
  ).toBeVisible();
  await expect(
    page.locator("label").filter({ hasText: /^Image$/ }),
  ).toBeVisible();
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
