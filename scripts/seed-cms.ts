import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../src/data/products.generated";
import { PRODUCT_OVERRIDES } from "../src/data/product_overrides";
import { BLOG_POSTS } from "../src/data/blog.generated";
import { DEFAULT_MANAGED_PAGES, DEFAULT_MANAGED_PROJECTS } from "../src/data/site-content.defaults";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

// Upsert makes the initial migration repeatable without duplicating content.
const { error: productError } = await supabase.from("cms_products").upsert(
  PRODUCTS.map((product) => ({
    slug: product.slug,
    title: product.name,
    material: product.materialName,
    status: "published",
    image_url: PRODUCT_OVERRIDES[product.slug]?.imageUrl ?? null,
    content: {
      ...product,
      description: PRODUCT_OVERRIDES[product.slug]?.description,
    },
  })),
  { onConflict: "slug" }
);
if (productError) throw productError;

const { error: blogError } = await supabase.from("cms_blog_posts").upsert(
  BLOG_POSTS.map((post) => ({
    slug: post.slug,
    title: post.title,
    status: "published",
    hero_image_url: post.heroImageUrl ?? null,
    content: post,
  })),
  { onConflict: "slug" }
);
if (blogError) throw blogError;

const { error: pageError } = await supabase.from("cms_pages").upsert(
  Object.values(DEFAULT_MANAGED_PAGES).map((page) => ({
    page_key: page.key,
    title: page.title,
    status: "published",
    hero_image_url: page.heroImageUrl ?? null,
    content: { blocks: page.blocks },
  })),
  { onConflict: "page_key" }
);
if (pageError) throw pageError;

const { error: projectError } = await supabase.from("cms_projects").upsert(
  DEFAULT_MANAGED_PROJECTS.map((project) => ({
    slug: project.slug,
    title: project.title,
    category: project.category,
    status: "published",
    hero_image_url: project.image,
    content: project,
  })),
  { onConflict: "slug" }
);
if (projectError) throw projectError;

console.log(`Seeded ${PRODUCTS.length} products, ${BLOG_POSTS.length} blog posts, ${Object.keys(DEFAULT_MANAGED_PAGES).length} pages and ${DEFAULT_MANAGED_PROJECTS.length} projects`);
