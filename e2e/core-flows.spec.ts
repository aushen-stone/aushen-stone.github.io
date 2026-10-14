import { expect, test } from "@playwright/test";

test("homepage renders its primary conversion paths", async ({
  page,
}) => {
  const pageErrors: Error[] = [];
  page.on("pageerror", (error) => pageErrors.push(error));

  await page.goto("/");

  await expect(page).toHaveTitle(/Aushen Stone/);
  await expect(
    page.getByRole("heading", { name: "Natural Stone Suppliers", exact: true })
  ).toBeVisible();
  await expect(page.getByText("Where Natural Stone Meets Architecture.", { exact: true })).toBeVisible();
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

test("product material filters update the catalogue heading", async ({ page }) => {
  await page.goto("/products/?category=bluestone");
  await expect(page.getByRole("heading", { level: 1, name: "Bluestone" })).toBeVisible();
  await expect(page.getByText("When it comes to elevating the aesthetics of your home", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "Filter by material" }).click();
  await page.getByRole("option", { name: "All Materials" }).click();
  await page.getByRole("option", { name: "Limestone" }).click();
  await page.getByRole("button", { name: "Done" }).click();
  await expect(page).toHaveURL(/material=limestone/);
  await expect(page.getByRole("heading", { level: 1, name: "Limestone" })).toBeVisible();
  await expect(page.getByText("Enhance your home or commercial project with premium limestone", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "Clear Filters" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Stone Products" })).toBeVisible();
});

test("product application hover photos load only after desktop interaction", async ({ page }, testInfo) => {
  await page.goto("/products/?q=Antarctica");
  const card = page.locator("#product-antarctica");
  await expect(card).toBeVisible();
  await expect(card.getByAltText("Antarctica White application")).toHaveCount(0);

  if (testInfo.project.name.startsWith("desktop")) {
    await card.hover();
    const applicationImage = card.getByAltText("Antarctica White application");
    await expect(applicationImage).toBeVisible();
    await expect.poll(() =>
      applicationImage.evaluate((element: HTMLImageElement) => element.naturalWidth),
    ).toBeGreaterThan(0);
  }
});

test("SEO landing product cards match the catalogue and support application hover", async ({ page }, testInfo) => {
  await page.goto("/products/material/marble/");
  const card = page.locator("#product-antarctica");
  await expect(card).toBeVisible();

  const productImage = card.getByAltText("Antarctica White", { exact: true });
  await expect(productImage).toBeVisible();
  const box = await productImage.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width / box!.height).toBeCloseTo(1.25, 1);
  await expect(card.getByAltText("Antarctica White application")).toHaveCount(0);

  if (testInfo.project.name.startsWith("desktop")) {
    await card.hover();
    const applicationImage = card.getByAltText("Antarctica White application");
    await expect(applicationImage).toBeVisible();
    await expect.poll(() =>
      applicationImage.evaluate((element: HTMLImageElement) => element.naturalWidth),
    ).toBeGreaterThan(0);
  }
});

test("Siena Earth large product image is non-empty", async ({ page }) => {
  await page.goto("/products/siena-earth/");
  const image = page.locator('main img[alt^="Siena Earth"]').first();
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
});

test("product heading names material and application filter results", async ({ page }) => {
  await page.goto("/products/");
  await page.getByRole("button", { name: "Filter by material" }).click();
  await page.getByRole("option", { name: "Bluestone" }).click();
  await page.getByRole("button", { name: "Done" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bluestone");
  await page.getByRole("button", { name: "Filter by application" }).click();
  await page.getByRole("option", { name: "Paver", exact: true }).click();
  await page.getByRole("button", { name: "Done" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Bluestone & Paver");
});

test("product material and application filters support shareable multi-selection", async ({ page }) => {
  await page.goto("/products/");

  await page.getByRole("button", { name: "Filter by material" }).click();
  await page.getByRole("option", { name: "Bluestone" }).click();
  await expect(page).toHaveURL(/material=bluestone/);
  await page.getByRole("option", { name: "Marble" }).click();
  await expect(page).toHaveURL(/material=bluestone.*material=marble/);
  await expect(page.getByRole("button", { name: "Filter by material" })).toHaveText(/2 Materials/);
  await page.getByRole("button", { name: "Done" }).click();

  await page.getByRole("button", { name: "Filter by application" }).click();
  await page.getByRole("option", { name: "Paver", exact: true }).click();
  await expect(page).toHaveURL(/application=paver/);
  await page.getByRole("option", { name: "Pool Coping", exact: true }).click();
  await expect(page).toHaveURL(/application=paver.*application=pool-coping/);
  await expect(page.getByRole("button", { name: "Filter by application" })).toHaveText(/2 Applications/);
  await page.getByRole("button", { name: "Done" }).click();

  const resultCount = await page.locator('a[id^="product-"]').count();
  expect(resultCount).toBeGreaterThan(0);
  await page.reload();
  await expect(page.getByRole("button", { name: "Filter by material" })).toHaveText(/2 Materials/);
  await expect(page.getByRole("button", { name: "Filter by application" })).toHaveText(/2 Applications/);
  await expect(page.locator('a[id^="product-"]')).toHaveCount(resultCount);
});

test("product applications drive catalogue filtering and availability selections", async ({ page }) => {
  await page.goto("/products/");
  await page.getByRole("button", { name: "Filter by application" }).click();
  await page.getByRole("option", { name: "Pool Coping", exact: true }).click();
  await page.getByRole("button", { name: "Done" }).click();
  await expect(page).toHaveURL(/application=pool-coping/);
  await expect(page.getByText("Filters applied")).toBeVisible();
  expect(await page.locator('a[id^="product-"]').count()).toBeGreaterThan(0);

  await page.goto("/products/antarctica/");
  await expect(
    page.getByRole("button", { name: "Request a Quote", exact: true }),
  ).toBeVisible();
  await page.getByRole("combobox", { name: "Select application" }).selectOption("pool-coping--drop-face");
  await expect(page.getByRole("combobox", { name: "Select surface finish" })).toHaveValue("sandblasted-p5");
  await expect(page.getByText("Pool Coping / Drop Face", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("600x400x20/60mm", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("P5", { exact: true }).last()).toBeVisible();

  await page.getByRole("button", { name: "Suitability & Application" }).click();
  await expect(
    page.getByText("Paver, Pool Coping / Drop Face, Pool Coping / Bull Nose, Slab", {
      exact: true,
    }),
  ).toBeVisible();
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

test("product quote request opens a dialog with the current selection", async ({ page }) => {
  await page.goto("/products/antarctica/");
  await expect(page.getByText("Check availability for", { exact: false })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Enquiry", exact: true })).toHaveCount(0);

  await page.getByRole("combobox", { name: "Select application" }).selectOption("pool-coping--drop-face");
  await page.getByRole("button", { name: "Request a Quote", exact: true }).click();

  const dialog = page.getByRole("dialog", { name: "Antarctica" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/Pool Coping \/ Drop Face/)).toBeVisible();
  await expect(dialog.getByRole("textbox", { name: "First name" })).toBeFocused();
  await expect(dialog.getByRole("button", { name: "Send Quote Request" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("header exposes a landline call button on every page", async ({ page }, testInfo) => {
  for (const path of ["/", "/services/"]) {
    await page.goto(path);

    const call = page.getByRole("banner").getByRole("link", { name: "Call 03-9585 7005" });
    await expect(call).toBeVisible();
    await expect(call).toHaveAttribute("href", "tel:+61395857005");
    // Desktop shows the number next to the icon; mobile keeps the icon only.
    if (testInfo.project.name.startsWith("mobile")) {
      await expect(call.getByText("03-9585 7005")).toBeHidden();
    } else {
      await expect(call.getByText("03-9585 7005")).toBeVisible();
    }
  }
});

test("fabrication page opens the quote dialog from the hero and a centred floating CTA", async ({ page }) => {
  await page.goto("/services/");

  const dialog = page.getByRole("dialog", { name: "Tell Us What You Need Cut" });
  const heroQuote = page.locator("main > section").first().getByRole("button", { name: "Request a Quote" });
  await heroQuote.click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("textbox", { name: "First name" })).toBeFocused();
  await expect(dialog.getByRole("button", { name: "Send Quote Request" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  const floatingQuote = page.locator("div.fixed").getByRole("button", { name: "Request a Quote" });
  await expect(floatingQuote).toHaveCount(0);
  await page.mouse.wheel(0, 1600);
  await expect(floatingQuote).toBeVisible();
  await expect(floatingQuote.locator("..")).toHaveCSS("opacity", "1");

  // Floating CTA is vertically centred in the viewport.
  const box = await floatingQuote.boundingBox();
  const viewport = page.viewportSize();
  expect(box && viewport).toBeTruthy();
  expect(Math.abs(box!.y + box!.height / 2 - viewport!.height / 2)).toBeLessThan(12);

  await floatingQuote.click();
  await expect(dialog).toBeVisible();
});
