import fs from "fs";
import path from "path";

type CsvRow = string[];

type ApplicationColumn = {
  index: number;
  category: string;
  categorySlug: string;
  subtype?: string;
  subtypeSlug?: string;
  label: string;
  id: string;
};

type ParsedSize = {
  raw: string;
  unit: "mm";
  lengthMm?: number;
  widthMm?: number;
  thicknessMm?: number | [number, number];
  heightMm?: number;
};

type FinishDraft = {
  name: string;
  slipRating?: string;
  applications: Map<string, ApplicationDraft>;
};

type ApplicationDraft = {
  id: string;
  label: string;
  category: string;
  categorySlug: string;
  subtype?: string;
  subtypeSlug?: string;
  sizes: ParsedSize[];
};

type ProductDraft = {
  id: string;
  name: string;
  slug: string;
  materialId: string;
  materialName: string;
  finishes: Map<string, FinishDraft>;
  media?: {
    productPhoto?: "Y" | "N";
    applicationPhoto?: { have: number; target: number };
  };
};

function parseCsv(text: string): CsvRow[] {
  const rows: CsvRow[] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === "\"") {
        const next = text[i + 1];
        if (next === "\"") {
          field += "\"";
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === "\"") {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char === "\r") {
      continue;
    }

    field += char;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
}

function slugify(value: string): string {
  return normalizeText(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function parseSize(raw: string): ParsedSize {
  const normalized = normalizeText(raw);
  const stripped = normalized.replace(/mm$/i, "").trim();

  if (/[a-z()]/i.test(stripped) || stripped.includes("-")) {
    return { raw: normalized, unit: "mm" };
  }

  const rangeMatch = stripped.match(
    /^(\d+)\s*x\s*(\d+)\s*x\s*(\d+)\s*\/\s*(\d+)$/i
  );
  if (rangeMatch) {
    return {
      raw: normalized,
      unit: "mm",
      lengthMm: Number(rangeMatch[1]),
      widthMm: Number(rangeMatch[2]),
      thicknessMm: [Number(rangeMatch[3]), Number(rangeMatch[4])],
    };
  }

  const simpleMatch = stripped.match(
    /^(\d+)\s*x\s*(\d+)\s*x\s*(\d+)(?:\s*x\s*(\d+))?$/i
  );
  if (simpleMatch) {
    const lengthMm = Number(simpleMatch[1]);
    const widthMm = Number(simpleMatch[2]);
    const thicknessMm = Number(simpleMatch[3]);
    const heightMm = simpleMatch[4] ? Number(simpleMatch[4]) : undefined;
    return {
      raw: normalized,
      unit: "mm",
      lengthMm,
      widthMm,
      thicknessMm,
      heightMm,
    };
  }

  return { raw: normalized, unit: "mm" };
}

function parseApplicationPhoto(value: string): { have: number; target: number } | null {
  const match = value.match(/(\d+)\s*\/\s*(\d+)/);
  if (!match) {
    return null;
  }
  return { have: Number(match[1]), target: Number(match[2]) };
}

function mergeProductPhoto(
  existing: "Y" | "N" | undefined,
  next: string
): "Y" | "N" | undefined {
  if (!next) return existing;
  if (next === "Y") return "Y";
  if (existing === "Y") return "Y";
  if (next === "N") return "N";
  return existing;
}

function mergeApplicationPhoto(
  existing: { have: number; target: number } | undefined,
  nextValue: string
): { have: number; target: number } | undefined {
  if (!nextValue) return existing;
  const parsed = parseApplicationPhoto(nextValue);
  if (!parsed) return existing;
  if (!existing) return parsed;
  if (parsed.target > existing.target) return parsed;
  if (parsed.target === existing.target && parsed.have > existing.have) return parsed;
  return existing;
}

function buildApplicationColumns(header1: string[], header2: string[]): ApplicationColumn[] {
  const filledHeader1 = header1.slice();
  let lastGroup = "";

  for (let i = 0; i < filledHeader1.length; i += 1) {
    const value = normalizeText(filledHeader1[i] || "");
    if (value) {
      lastGroup = value;
      filledHeader1[i] = value;
    } else if (i >= 4 && i <= 22) {
      filledHeader1[i] = lastGroup;
    } else {
      filledHeader1[i] = value;
    }
  }

  const columns: ApplicationColumn[] = [];
  for (let i = 4; i <= 22; i += 1) {
    const category = normalizeText(filledHeader1[i] || "");
    const subtype = normalizeText(header2[i] || "");
    const finalCategory = category || subtype;
    const finalSubtype = category ? subtype : undefined;
    const categorySlug = slugify(finalCategory);
    const subtypeSlug = finalSubtype ? slugify(finalSubtype) : undefined;
    const label = finalSubtype ? `${finalCategory} / ${finalSubtype}` : finalCategory;
    const id = subtypeSlug ? `${categorySlug}--${subtypeSlug}` : categorySlug;
    columns[i] = {
      index: i,
      category: finalCategory,
      categorySlug,
      subtype: finalSubtype || undefined,
      subtypeSlug,
      label,
      id,
    };
  }

  return columns;
}

function main() {
  const scriptDir = __dirname;
  const cwd = process.cwd();
  const rootDir = fs.existsSync(path.resolve(scriptDir, "..", "src"))
    ? path.resolve(scriptDir, "..")
    : cwd;
  const csvPath = path.resolve(rootDir, "../docs/aushen_product_library.csv");
  const outputProducts = path.resolve(rootDir, "src/data/products.generated.ts");
  const outputCategories = path.resolve(rootDir, "src/data/categories.generated.ts");

  const rawCsv = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCsv(rawCsv);

  if (rows.length < 4) {
    throw new Error("CSV does not contain enough rows.");
  }

  const header1 = rows[1];
  const header2 = rows[2];
  const applicationColumns = buildApplicationColumns(header1, header2);

  const products = new Map<string, ProductDraft>();
  const materialSlugMap = new Map<string, string>();
  const productSlugMap = new Map<string, number>();

  const categories = new Map<string, { name: string; slug: string; subtypes: Map<string, string> }>();
  for (let i = 4; i <= 22; i += 1) {
    const column = applicationColumns[i];
    if (!column?.category) continue;
    if (!categories.has(column.categorySlug)) {
      categories.set(column.categorySlug, {
        name: column.category,
        slug: column.categorySlug,
        subtypes: new Map<string, string>(),
      });
    }
    if (column.subtype && column.subtypeSlug) {
      categories.get(column.categorySlug)?.subtypes.set(column.subtypeSlug, column.subtype);
    }
  }

  const current = {
    material: "",
    product: "",
    finish: "",
    slip: "",
  };

  for (const row of rows.slice(3)) {
    if (!row.length) continue;

    if (row[0] && row[0].trim()) current.material = normalizeText(row[0]);
    if (row[1] && row[1].trim()) current.product = normalizeText(row[1]);
    if (row[2] && row[2].trim()) current.finish = normalizeText(row[2]);
    if (row[3] && row[3].trim()) current.slip = normalizeText(row[3]);

    if (!current.product || !current.material) {
      continue;
    }

    const materialSlug =
      materialSlugMap.get(current.material) || slugify(current.material);
    materialSlugMap.set(current.material, materialSlug);

    const productKey = `${current.material}::${current.product}`;
    let product = products.get(productKey);
    if (!product) {
      const baseSlug = slugify(current.product);
      const count = (productSlugMap.get(baseSlug) || 0) + 1;
      productSlugMap.set(baseSlug, count);
      const uniqueSlug = count > 1 ? `${baseSlug}-${count}` : baseSlug;
      product = {
        id: uniqueSlug,
        name: current.product,
        slug: uniqueSlug,
        materialId: materialSlug,
        materialName: current.material,
        finishes: new Map<string, FinishDraft>(),
      };
      products.set(productKey, product);
    }

    if (row[23] && row[23].trim()) {
      product.media = product.media || {};
      product.media.productPhoto = mergeProductPhoto(product.media.productPhoto, row[23].trim());
    }
    if (row[24] && row[24].trim()) {
      product.media = product.media || {};
      product.media.applicationPhoto = mergeApplicationPhoto(
        product.media.applicationPhoto,
        row[24].trim()
      );
    }

    const finishKey = `${current.finish}||${current.slip}`;
    let finish = product.finishes.get(finishKey);
    if (!finish) {
      finish = {
        name: current.finish || "Unspecified",
        slipRating: current.slip || undefined,
        applications: new Map<string, ApplicationDraft>(),
      };
      product.finishes.set(finishKey, finish);
    }

    for (let i = 4; i <= 22; i += 1) {
      const rawValue = row[i];
      if (!rawValue || !rawValue.trim()) continue;
      const column = applicationColumns[i];
      if (!column || !column.category) continue;

      let application = finish.applications.get(column.id);
      if (!application) {
        application = {
          id: column.id,
          label: column.label,
          category: column.category,
          categorySlug: column.categorySlug,
          subtype: column.subtype,
          subtypeSlug: column.subtypeSlug,
          sizes: [],
        };
        finish.applications.set(column.id, application);
      }

      const parsedSize = parseSize(rawValue);
      if (!application.sizes.find((size) => size.raw === parsedSize.raw)) {
        application.sizes.push(parsedSize);
      }
    }
  }

  const materials = Array.from(materialSlugMap.entries())
    .map(([name, slug]) => ({ id: slug, name, slug }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const productList = Array.from(products.values())
    .map((product) => {
      const finishes = Array.from(product.finishes.values()).map((finish) => {
        const finishSlugBase = slugify(finish.name || "finish");
        const finishId = finish.slipRating
          ? `${finishSlugBase}-${slugify(finish.slipRating)}`
          : finishSlugBase;
        const applications = Array.from(finish.applications.values()).map((app) => ({
          ...app,
          sizes: app.sizes.slice(),
        }));
        return {
          id: finishId,
          name: finish.name,
          slipRating: finish.slipRating,
          applications,
        };
      });

      const applicationIndexMap = new Map<
        string,
        {
          id: string;
          label: string;
          category: string;
          categorySlug: string;
          subtype?: string;
          subtypeSlug?: string;
          finishes: {
            id: string;
            name: string;
            slipRating?: string;
            sizes: ParsedSize[];
          }[];
        }
      >();

      finishes.forEach((finish) => {
        finish.applications.forEach((app) => {
          let entry = applicationIndexMap.get(app.id);
          if (!entry) {
            entry = {
              id: app.id,
              label: app.label,
              category: app.category,
              categorySlug: app.categorySlug,
              subtype: app.subtype,
              subtypeSlug: app.subtypeSlug,
              finishes: [],
            };
            applicationIndexMap.set(app.id, entry);
          }
          entry.finishes.push({
            id: finish.id,
            name: finish.name,
            slipRating: finish.slipRating,
            sizes: app.sizes.map((size) => ({ ...size })),
          });
        });
      });

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        materialId: product.materialId,
        materialName: product.materialName,
        finishes,
        applicationIndex: Array.from(applicationIndexMap.values()),
        media: product.media,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const categoriesOutput = {
    materials: materials.map((material) => ({ name: material.name, slug: material.slug })),
    applications: Array.from(categories.values())
      .map((category) => ({
        name: category.name,
        slug: category.slug,
        subtypes:
          category.subtypes.size > 0
            ? Array.from(category.subtypes.entries())
                .map(([slug, name]) => ({ name, slug }))
                .sort((a, b) => a.name.localeCompare(b.name))
            : undefined,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };

  const banner = "// This file is auto-generated by scripts/build-product-data.ts. Do not edit.\n";

  const productsFile =
    banner +
    "import type { Material, Product } from \"@/types/product\";\n\n" +
    `export const MATERIALS: Material[] = ${JSON.stringify(materials, null, 2)};\n\n` +
    `export const PRODUCTS: Product[] = ${JSON.stringify(productList, null, 2)};\n`;

  const categoriesFile =
    banner +
    "import type { ProductCategories } from \"@/types/product\";\n\n" +
    `export const PRODUCT_CATEGORIES: ProductCategories = ${JSON.stringify(
      categoriesOutput,
      null,
      2
    )};\n`;

  fs.writeFileSync(outputProducts, productsFile, "utf-8");
  fs.writeFileSync(outputCategories, categoriesFile, "utf-8");

  console.log(`Generated ${productList.length} products, ${materials.length} materials.`);
}

main();
