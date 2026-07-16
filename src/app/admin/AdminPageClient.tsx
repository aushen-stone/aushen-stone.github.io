/* eslint-disable @next/next/no-img-element -- CMS URLs are user-managed and unknown at build time. */
"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  Box,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  House,
  KeyRound,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Upload,
  UserPlus,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabaseClient";
import {
  applyLegacyPageHeroImage,
  buildCmsContent,
  slugifyCmsValue,
} from "@/lib/cmsContent";
import type { CmsEntityType, CmsRow, CmsStatus } from "@/types/cms";
import {
  DEFAULT_MANAGED_PAGES,
  DEFAULT_MANAGED_PROJECTS,
} from "@/data/site-content.defaults";
import { DEFAULT_LEGACY_PAGES } from "@/data/legacy-page.defaults";
import type { ApplicationIndexEntry } from "@/types/product";
import ProductSpecificationsEditor from "./ProductSpecificationsEditor";
import { StructuredContentEditor } from "./StructuredContentEditor";

// The editor is only needed after an administrator opens a blog form, so keep
// its ProseMirror runtime out of the public site and the initial admin bundle.
const BlogRichTextEditor = dynamic(() => import("./BlogRichTextEditor"), {
  ssr: false,
  loading: () => <div className="min-h-[22rem] animate-pulse bg-[#F8F5F1]" />,
});

type EditorState = {
  id?: string;
  title: string;
  slug: string;
  secondaryLabel: string;
  status: CmsStatus;
  imageUrl: string;
  applicationImageUrls: string[];
  summary: string;
  bodyHtml: string;
  bodyJson: string;
  categories: string;
  advancedJson: string;
};

const EMPTY_EDITOR: EditorState = {
  title: "",
  slug: "",
  secondaryLabel: "",
  status: "draft",
  imageUrl: "",
  applicationImageUrls: [],
  summary: "",
  bodyHtml: "",
  bodyJson: "",
  categories: "",
  advancedJson: "{}",
};

const PAGE_ENTITIES = new Set<CmsEntityType>(["home", "services", "about"]);
const ENTITY_LABELS: Record<CmsEntityType, string> = {
  products: "Products",
  blog: "Blog",
  projects: "Projects",
  home: "Home",
  services: "Services",
  about: "Our Story",
};
const ALL_ENTITIES = Object.keys(ENTITY_LABELS) as CmsEntityType[];

type ManagedUser = {
  id: string;
  email: string;
  superAdmin: boolean;
  permissions: CmsEntityType[];
  createdAt: string;
};

const tableForEntity = (entity: CmsEntityType) =>
  entity === "products"
    ? "cms_products"
    : entity === "blog"
      ? "cms_blog_posts"
      : entity === "projects"
        ? "cms_projects"
        : "cms_pages";

const DEMO_ROWS: Record<CmsEntityType, CmsRow[]> = {
  products: [
    {
      id: "demo-1",
      slug: "grey-apricot",
      title: "Grey Apricot Marble",
      status: "published",
      imageUrl: "/product-photos/grey-apricot-01.webp",
      secondaryLabel: "Marble",
      content: {
        name: "Grey Apricot Marble",
        slug: "grey-apricot",
        description: "Warm architectural marble.",
        finishes: [],
        applicationIndex: [],
      },
      updatedAt: "2026-07-10T01:30:00Z",
    },
    {
      id: "demo-2",
      slug: "blueocean",
      title: "BlueOcean Sawn",
      status: "published",
      imageUrl: "/product-photos/blueocean-01.webp",
      secondaryLabel: "Bluestone",
      content: {
        name: "BlueOcean Sawn",
        slug: "blueocean",
        description: "Textural natural bluestone.",
        finishes: [],
        applicationIndex: [],
      },
      updatedAt: "2026-07-09T05:10:00Z",
    },
    {
      id: "demo-3",
      slug: "silver-ash",
      title: "Silver Ash Marble",
      status: "draft",
      imageUrl: "/product-photos/silver-ash-01.webp",
      secondaryLabel: "Marble",
      content: {
        name: "Silver Ash Marble",
        slug: "silver-ash",
        description: "Soft silver-grey marble.",
        finishes: [],
        applicationIndex: [],
      },
      updatedAt: "2026-07-08T23:45:00Z",
    },
  ],
  blog: [
    {
      id: "demo-blog",
      slug: "choosing-stone-for-outdoor-spaces",
      title: "Choosing Stone for Outdoor Spaces",
      status: "draft",
      imageUrl: "/AushenShop.webp",
      secondaryLabel: "Blog post",
      content: {
        excerpt: "A practical material guide.",
        bodyHtml: "<p>A practical material guide.</p>",
        categories: [{ name: "Stone", slug: "stone" }],
      },
      updatedAt: "2026-07-10T02:00:00Z",
    },
  ],
  projects: DEFAULT_MANAGED_PROJECTS.slice(0, 3).map((project, index) => ({
    id: `demo-project-${index}`,
    slug: project.slug,
    title: project.title,
    status: "published",
    imageUrl: project.image,
    secondaryLabel: project.category,
    content: project,
    updatedAt: "2026-07-10T02:00:00Z",
  })),
  home: [
    {
      id: "home",
      slug: "home",
      title: "Home",
      status: "published",
      imageUrl: DEFAULT_MANAGED_PAGES.home.heroImageUrl ?? null,
      secondaryLabel: "Managed page",
      content: DEFAULT_LEGACY_PAGES.home,
      updatedAt: "2026-07-10T02:00:00Z",
    },
  ],
  services: [
    {
      id: "services",
      slug: "services",
      title: "Services",
      status: "published",
      imageUrl: DEFAULT_MANAGED_PAGES.services.heroImageUrl ?? null,
      secondaryLabel: "Managed page",
      content: DEFAULT_LEGACY_PAGES.services,
      updatedAt: "2026-07-10T02:00:00Z",
    },
  ],
  about: [
    {
      id: "about",
      slug: "about",
      title: "Our Story",
      status: "published",
      imageUrl: DEFAULT_MANAGED_PAGES.about.heroImageUrl ?? null,
      secondaryLabel: "Managed page",
      content: DEFAULT_LEGACY_PAGES.about,
      updatedAt: "2026-07-10T02:00:00Z",
    },
  ],
};

function editorFromRow(row: CmsRow): EditorState {
  const content = row.content;
  const pageKey =
    row.slug === "home" || row.slug === "services" || row.slug === "about"
      ? row.slug
      : null;
  // Earlier CMS builds stored generic `blocks` that could not reproduce the
  // legacy design. Upgrade those rows in the editor to the exact legacy schema
  // so the next save is safe and immediately editable.
  const editableContent =
    pageKey && !("hero" in content) ? DEFAULT_LEGACY_PAGES[pageKey] : content;
  const categories = Array.isArray(content.categories)
    ? content.categories
        .map((category) =>
          typeof category === "object" && category && "name" in category
            ? String(category.name)
            : "",
        )
        .filter(Boolean)
        .join(", ")
    : "";

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    secondaryLabel: row.secondaryLabel,
    status: row.status,
    imageUrl: row.imageUrl ?? "",
    applicationImageUrls: Array.isArray(content.applicationImageUrls)
      ? content.applicationImageUrls.filter(
          (value): value is string => typeof value === "string",
        )
      : [],
    summary: String(content.description ?? content.excerpt ?? ""),
    bodyHtml: String(content.bodyHtml ?? ""),
    bodyJson:
      content.editorJson && typeof content.editorJson === "object"
        ? JSON.stringify(content.editorJson)
        : "",
    categories,
    advancedJson: JSON.stringify(editableContent, null, 2),
  };
}

export default function AdminPageClient() {
  const configured = isSupabaseConfigured();
  const [demoMode, setDemoMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [permissions, setPermissions] = useState<CmsEntityType[]>([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [entity, setEntity] = useState<CmsEntityType>("products");
  const [rows, setRows] = useState<CmsRow[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CmsStatus>("all");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const loadRows = useCallback(async () => {
    if (demoMode) {
      setRows(DEMO_ROWS[entity]);
      return;
    }
    if (!configured || !permissions.includes(entity)) return;
    setBusy(true);
    setMessage("");
    try {
      const supabase = getSupabaseBrowserClient();
      const table = tableForEntity(entity);
      let request = supabase
        .from(table)
        .select("*")
        .order("updated_at", { ascending: false });
      if (PAGE_ENTITIES.has(entity)) request = request.eq("page_key", entity);
      const { data, error } = await request;
      if (error) throw error;

      setRows(
        (data ?? []).map((row) => ({
          id: row.id ?? row.page_key,
          slug: row.slug ?? row.page_key,
          title: row.title,
          status: row.status,
          imageUrl: entity === "products" ? row.image_url : row.hero_image_url,
          secondaryLabel:
            entity === "products"
              ? row.material
              : entity === "projects"
                ? row.category
                : PAGE_ENTITIES.has(entity)
                  ? "Managed page"
                  : "Blog post",
          content: row.content,
          updatedAt: row.updated_at,
        })),
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load content",
      );
    } finally {
      setBusy(false);
    }
  }, [configured, demoMode, entity, permissions]);

  useEffect(() => {
    // Development-only demo makes the complete static Admin UI reviewable without credentials.
    if (process.env.NODE_ENV !== "production") {
      setDemoMode(
        new URLSearchParams(window.location.search).get("demo") === "1",
      );
    }
  }, []);

  useEffect(() => {
    if (!configured || demoMode) return;
    const supabase = getSupabaseBrowserClient();
    const applySession = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      setUserEmail(user?.email ?? null);
      if (!user) {
        setIsAdmin(false);
        setPermissions([]);
        return;
      }
      const [{ data: allowed }, { data: granted }] = await Promise.all([
        supabase.rpc("is_admin"),
        supabase.rpc("my_cms_permissions"),
      ]);
      setIsAdmin(allowed === true);
      const nextPermissions = (Array.isArray(granted) ? granted : []).filter(
        (item): item is CmsEntityType =>
          ALL_ENTITIES.includes(item as CmsEntityType),
      );
      setPermissions(nextPermissions);
      if (nextPermissions.length && !nextPermissions.includes(entity))
        setEntity(nextPermissions[0]);
    };
    void applySession();
    const { data: listener } = supabase.auth.onAuthStateChange(
      () => void applySession(),
    );
    return () => listener.subscription.unsubscribe();
  }, [configured, demoMode, entity]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const filteredRows = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      return (
        !normalized ||
        `${row.title} ${row.slug} ${row.secondaryLabel}`
          .toLowerCase()
          .includes(normalized)
      );
    });
  }, [query, rows, statusFilter]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await getSupabaseBrowserClient().auth.signInWithPassword({
      email,
      password,
    });
    if (error) setMessage(error.message);
    setBusy(false);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editor) return;
    const articleText = editor.bodyHtml.replace(/<[^>]*>/g, "").replace(/&nbsp;/gi, " ").trim();
    if (entity === "blog" && !articleText && !/<img\b/i.test(editor.bodyHtml)) {
      setMessage("Article content is required.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      if (demoMode) {
        const content = buildCmsContent(entity, editor);
        const demoRow: CmsRow = {
          id: editor.id ?? crypto.randomUUID(),
          slug: editor.slug,
          title: editor.title,
          status: editor.status,
          imageUrl: editor.imageUrl || null,
          secondaryLabel:
            entity === "products" || entity === "projects"
              ? editor.secondaryLabel
              : PAGE_ENTITIES.has(entity)
                ? "Managed page"
                : "Blog post",
          content,
          updatedAt: new Date().toISOString(),
        };
        setRows((current) =>
          editor.id
            ? current.map((row) => (row.id === editor.id ? demoRow : row))
            : [demoRow, ...current],
        );
        setEditor(null);
        setMessage(
          "Demo saved locally. Production writes require Supabase configuration.",
        );
        return;
      }
      const supabase = getSupabaseBrowserClient();
      const { data: auth } = await supabase.auth.getUser();
      const content = buildCmsContent(entity, editor);
      const base = {
        title: editor.title,
        status: editor.status,
        content,
        updated_by: auth.user?.id,
        updated_at: new Date().toISOString(),
      };
      // Each table payload is explicit so page keys and repeatable slugs cannot cross tables.
      let error: { message: string } | null = null;
      if (entity === "products") {
        ({ error } = editor.id
          ? await supabase
              .from("cms_products")
              .update({
                ...base,
                slug: editor.slug,
                material: editor.secondaryLabel,
                image_url: editor.imageUrl || null,
              })
              .eq("id", editor.id)
          : await supabase
              .from("cms_products")
              .insert({
                ...base,
                slug: editor.slug,
                material: editor.secondaryLabel,
                image_url: editor.imageUrl || null,
              }));
      } else if (entity === "blog") {
        ({ error } = editor.id
          ? await supabase
              .from("cms_blog_posts")
              .update({
                ...base,
                slug: editor.slug,
                hero_image_url: editor.imageUrl || null,
              })
              .eq("id", editor.id)
          : await supabase
              .from("cms_blog_posts")
              .insert({
                ...base,
                slug: editor.slug,
                hero_image_url: editor.imageUrl || null,
              }));
      } else if (entity === "projects") {
        ({ error } = editor.id
          ? await supabase
              .from("cms_projects")
              .update({
                ...base,
                slug: editor.slug,
                category:
                  editor.secondaryLabel ||
                  editor.categories.split(",")[0]?.trim() ||
                  "Residential",
                hero_image_url: editor.imageUrl || null,
              })
              .eq("id", editor.id)
          : await supabase
              .from("cms_projects")
              .insert({
                ...base,
                slug: editor.slug,
                category:
                  editor.secondaryLabel ||
                  editor.categories.split(",")[0]?.trim() ||
                  "Residential",
                hero_image_url: editor.imageUrl || null,
              }));
      } else {
        ({ error } = await supabase
          .from("cms_pages")
          .upsert(
            {
              ...base,
              page_key: entity,
              hero_image_url: editor.imageUrl || null,
            },
            { onConflict: "page_key" },
          ));
      }
      if (error) throw error;
      setEditor(null);
      setMessage("Saved. Publish the site when the content is ready.");
      await loadRows();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row: CmsRow) => {
    if (!window.confirm(`Delete “${row.title}”? This cannot be undone.`))
      return;
    setBusy(true);
    if (demoMode) {
      setRows((current) => current.filter((item) => item.id !== row.id));
      setMessage("Demo row deleted locally.");
      setBusy(false);
      return;
    }
    const table = tableForEntity(entity);
    const deleteRequest = getSupabaseBrowserClient().from(table).delete();
    const { error } = PAGE_ENTITIES.has(entity)
      ? await deleteRequest.eq("page_key", entity)
      : await deleteRequest.eq("id", row.id);
    setMessage(
      error
        ? error.message
        : "Deleted. Publish the site to remove it publicly.",
    );
    await loadRows();
    setBusy(false);
  };

  const uploadImage = async (file: File) => {
    if (!editor) return;
    setBusy(true);
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const objectPath = `${entity}/${crypto.randomUUID()}-${safeName}`;
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.storage
      .from("cms-media")
      .upload(objectPath, file);
    if (error) setMessage(error.message);
    else {
      const { data } = supabase.storage
        .from("cms-media")
        .getPublicUrl(objectPath);
      setEditor((current) => {
        if (!current) return current;
        if (
          entity === "products" ||
          entity === "blog" ||
          entity === "projects"
        ) {
          return { ...current, imageUrl: data.publicUrl };
        }
        let advanced: Record<string, unknown> = {};
        try {
          advanced = JSON.parse(current.advancedJson) as Record<
            string,
            unknown
          >;
        } catch {
          // Save validation will report invalid advanced JSON.
        }
        return {
          ...current,
          imageUrl: data.publicUrl,
          advancedJson: JSON.stringify(
            applyLegacyPageHeroImage(entity, advanced, data.publicUrl),
            null,
            2,
          ),
        };
      });
    }
    setBusy(false);
  };

  const uploadApplicationImages = async (files: File[]) => {
    if (!editor || entity !== "products" || files.length === 0) return;
    setBusy(true);
    setMessage("");
    const supabase = getSupabaseBrowserClient();
    try {
      // Upload independently so selecting several application photos does not
      // create a slow sequential network waterfall.
      const urls = await Promise.all(
        files.map(async (file) => {
          const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
          const objectPath = `products/application/${crypto.randomUUID()}-${safeName}`;
          const { error } = await supabase.storage
            .from("cms-media")
            .upload(objectPath, file);
          if (error) throw error;
          return supabase.storage.from("cms-media").getPublicUrl(objectPath)
            .data.publicUrl;
        }),
      );
      setEditor((current) =>
        current
          ? {
              ...current,
              applicationImageUrls: [...current.applicationImageUrls, ...urls],
            }
          : current,
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to upload application photos",
      );
    } finally {
      setBusy(false);
    }
  };

  const uploadArticleImage = async (file: File): Promise<string> => {
    if (entity !== "blog") throw new Error("Article images are only available for blog posts.");
    if (file.size > 5 * 1024 * 1024) throw new Error("Article images must be 5 MB or smaller.");
    setBusy(true);
    setMessage("");
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const objectPath = `blog/article/${crypto.randomUUID()}-${safeName}`;
    const supabase = getSupabaseBrowserClient();
    try {
      const { error } = await supabase.storage.from("cms-media").upload(objectPath, file);
      if (error) throw error;
      return supabase.storage.from("cms-media").getPublicUrl(objectPath).data.publicUrl;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to upload article image";
      setMessage(message);
      throw error;
    } finally {
      setBusy(false);
    }
  };

  const publishSite = async () => {
    setBusy(true);
    setMessage("");
    if (demoMode) {
      setMessage(
        "Demo deployment requested. Production requires the Supabase Edge Function.",
      );
      setBusy(false);
      return;
    }
    const { error } = await getSupabaseBrowserClient().functions.invoke(
      "trigger-pages-deploy",
    );
    setMessage(
      error
        ? error.message
        : "Deployment requested. GitHub Pages will update in a few minutes.",
    );
    setBusy(false);
  };

  if (!configured && !demoMode) {
    return (
      <AdminNotice
        title="CMS setup required"
        message="Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local, then restart the development server."
      />
    );
  }

  if (!demoMode && (!userEmail || permissions.length === 0)) {
    return (
      <div className="fixed inset-0 z-[1000] grid min-h-screen place-items-center bg-[#F8F5F1] px-5">
        <form
          onSubmit={signIn}
          className="w-full max-w-md border border-[#D8D2C8] bg-white p-8 shadow-sm"
        >
          <div className="font-serif text-3xl tracking-[0.08em] text-[#1A1C18]">
            AUSHEN
          </div>
          <h1 className="mt-10 font-serif text-4xl text-[#1A1C18]">
            Admin sign in
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Use the authorised Supabase admin account.
          </p>
          <label className="mt-8 block text-xs uppercase tracking-[0.14em] text-gray-500">
            Email
            <input
              className="mt-2 h-12 w-full border border-[#D8D2C8] px-4 text-sm normal-case tracking-normal outline-none focus:border-[#3B4034]"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="mt-5 block text-xs uppercase tracking-[0.14em] text-gray-500">
            Password
            <input
              className="mt-2 h-12 w-full border border-[#D8D2C8] px-4 text-sm normal-case tracking-normal outline-none focus:border-[#3B4034]"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {message ? (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {message}
            </p>
          ) : null}
          {userEmail && permissions.length === 0 ? (
            <p role="alert" className="mt-4 text-sm text-red-700">
              This account has no CMS permissions. Ask a super admin to grant
              access.
            </p>
          ) : null}
          <button
            disabled={busy}
            className="mt-8 flex h-12 w-full items-center justify-center bg-[#283020] text-xs uppercase tracking-[0.14em] text-white disabled:opacity-60"
          >
            {busy ? <Loader2 className="animate-spin" size={18} /> : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] flex overflow-hidden bg-[#F8F5F1] text-[#1A1C18]">
      <aside className="hidden w-56 shrink-0 flex-col bg-[#171B17] px-5 py-8 text-white md:flex">
        <div className="font-serif text-3xl tracking-[0.08em]">AUSHEN</div>
        <nav className="mt-12 space-y-2">
          {(demoMode ? ALL_ENTITIES : permissions).map((item) => (
            <AdminNav
              key={item}
              icon={
                item === "products" ? (
                  <Box size={18} />
                ) : item === "blog" ? (
                  <BookOpen size={18} />
                ) : item === "projects" ? (
                  <BriefcaseBusiness size={18} />
                ) : item === "home" ? (
                  <House size={18} />
                ) : item === "services" ? (
                  <Wrench size={18} />
                ) : (
                  <ImageIcon size={18} />
                )
              }
              label={ENTITY_LABELS[item]}
              active={entity === item}
              onClick={() => {
                setEntity(item);
                setEditor(null);
              }}
            />
          ))}
          {isAdmin ? (
            <AdminNav
              icon={<Users size={18} />}
              label="Users & permissions"
              onClick={() => setShowUsers(true)}
            />
          ) : null}
        </nav>
        <div className="mt-auto space-y-4 border-t border-white/15 pt-6">
          <button
            onClick={() => setShowPassword(true)}
            className="flex items-center gap-3 text-sm text-white/80 hover:text-white"
          >
            <KeyRound size={18} />
            Change password
          </button>
          <button
            onClick={() => void getSupabaseBrowserClient().auth.signOut()}
            className="flex items-center gap-3 text-sm text-white/80 hover:text-white"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto px-5 py-7 sm:px-8 lg:px-10">
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 md:hidden">
          {(demoMode ? ALL_ENTITIES : permissions).map((item) => (
            <button
              key={item}
              onClick={() => {
                setEntity(item);
                setEditor(null);
              }}
              className={`h-10 shrink-0 px-4 text-xs uppercase tracking-[0.1em] ${entity === item ? "bg-[#283020] text-white" : "border border-[#D8D2C8] bg-white"}`}
            >
              {ENTITY_LABELS[item]}
            </button>
          ))}
          {isAdmin ? (
            <button
              aria-label="Manage users"
              onClick={() => setShowUsers(true)}
              className="grid h-10 w-10 shrink-0 place-items-center border border-[#D8D2C8] bg-white"
            >
              <Users size={16} />
            </button>
          ) : null}
          {!demoMode ? (
            <button
              aria-label="Change password"
              onClick={() => setShowPassword(true)}
              className="grid h-10 w-10 shrink-0 place-items-center border border-[#D8D2C8] bg-white"
            >
              <KeyRound size={16} />
            </button>
          ) : null}
          {!demoMode ? (
            <button
              aria-label="Sign out"
              onClick={() => void getSupabaseBrowserClient().auth.signOut()}
              className="ml-auto grid h-10 w-10 place-items-center border border-[#D8D2C8] bg-white"
            >
              <LogOut size={16} />
            </button>
          ) : null}
        </div>
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl sm:text-5xl">
              {ENTITY_LABELS[entity]}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {demoMode ? "admin@aushenstone.com · local demo" : userEmail}
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          >
            View site <ExternalLink size={15} />
          </a>
        </header>

        <section className="mt-8 flex flex-wrap items-center justify-between gap-5 border border-[#D8D2C8] bg-white p-5 sm:p-6">
          <div>
            <h2 className="font-serif text-xl">Site deployment</h2>
            <p className="mt-1 text-sm text-gray-600">
              Changes become public after GitHub Actions finishes rebuilding the
              static site.
            </p>
          </div>
          {demoMode || isAdmin ? (
            <button
              onClick={publishSite}
              disabled={busy}
              className="inline-flex min-h-11 items-center gap-2 bg-[#283020] px-5 text-xs uppercase tracking-[0.12em] text-white disabled:opacity-60"
            >
              <RefreshCw size={15} /> Publish site
            </button>
          ) : (
            <span className="text-xs uppercase tracking-[0.12em] text-gray-500">
              A super admin publishes the site
            </span>
          )}
        </section>

        {message ? (
          <p
            role="status"
            className="mt-4 border-l-2 border-[#758267] bg-white px-4 py-3 text-sm"
          >
            {message}
          </p>
        ) : null}

        <section className="mt-7">
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative min-w-64 flex-1">
              <Search
                className="absolute left-3 top-3.5 text-gray-400"
                size={17}
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${entity}...`}
                className="h-11 w-full border border-[#D8D2C8] bg-white pl-10 pr-4 text-sm outline-none focus:border-[#3B4034]"
              />
            </label>
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as typeof statusFilter)
              }
              className="h-11 border border-[#D8D2C8] bg-white px-4 text-sm"
            >
              <option value="all">All status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
            <button
              onClick={() => {
                const existing = PAGE_ENTITIES.has(entity) ? rows[0] : null;
                setEditor(
                  existing
                    ? editorFromRow(existing)
                    : {
                        ...EMPTY_EDITOR,
                        title: PAGE_ENTITIES.has(entity)
                          ? ENTITY_LABELS[entity]
                          : "",
                        slug: PAGE_ENTITIES.has(entity) ? entity : "",
                        advancedJson: PAGE_ENTITIES.has(entity)
                          ? JSON.stringify(
                              DEFAULT_LEGACY_PAGES[
                                entity as keyof typeof DEFAULT_LEGACY_PAGES
                              ],
                              null,
                              2,
                            )
                          : "{}",
                      },
                );
              }}
              className="inline-flex h-11 items-center gap-2 bg-[#283020] px-5 text-xs uppercase tracking-[0.12em] text-white"
            >
              <Plus size={16} />{" "}
              {PAGE_ENTITIES.has(entity)
                ? "Edit page"
                : `Add ${entity === "products" ? "product" : entity === "blog" ? "post" : "project"}`}
            </button>
          </div>

          <div className="mt-5 overflow-x-auto border border-[#D8D2C8] bg-white">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#D8D2C8] text-xs uppercase tracking-[0.12em] text-gray-500">
                  <th className="px-5 py-4">Content</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Updated</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-[#ECE8E1] last:border-0"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-4">
                        {row.imageUrl ? (
                          <img
                            src={row.imageUrl}
                            alt=""
                            className="h-14 w-14 object-cover"
                          />
                        ) : (
                          <div className="grid h-14 w-14 place-items-center bg-[#EEEAE3] text-gray-400">
                            <FileText size={20} />
                          </div>
                        )}
                        <div>
                          <div className="font-serif text-lg">{row.title}</div>
                          <div className="text-xs text-gray-500">
                            /{row.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm">{row.secondaryLabel}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs ${row.status === "published" ? "bg-[#E8EEE1] text-[#315333]" : "bg-[#FAEFCF] text-[#745B13]"}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {new Date(row.updatedAt).toLocaleString("en-AU")}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          aria-label={`Edit ${row.title}`}
                          onClick={() => setEditor(editorFromRow(row))}
                          className="grid h-9 w-9 place-items-center border border-[#D8D2C8] hover:bg-[#F8F5F1]"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          aria-label={`Delete ${row.title}`}
                          onClick={() => void remove(row)}
                          className="grid h-9 w-9 place-items-center border border-[#D8D2C8] text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!busy && filteredRows.length === 0 ? (
              <div className="px-5 py-14 text-center text-sm text-gray-500">
                No content matches the current filters.
              </div>
            ) : null}
          </div>
        </section>
      </main>

      {editor ? (
        <EditorPanel
          entity={entity}
          editor={editor}
          setEditor={setEditor}
          busy={busy}
          onSave={save}
          onUpload={uploadImage}
          onUploadApplications={uploadApplicationImages}
          onUploadArticleImage={uploadArticleImage}
        />
      ) : null}
      {showPassword ? (
        <PasswordPanel onClose={() => setShowPassword(false)} />
      ) : null}
      {showUsers && isAdmin ? (
        <UserManagementPanel onClose={() => setShowUsers(false)} />
      ) : null}
    </div>
  );
}

function AdminNotice({ title, message }: { title: string; message: string }) {
  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-[#F8F5F1] p-6">
      <div className="max-w-xl border border-[#D8D2C8] bg-white p-8">
        <h1 className="font-serif text-4xl">{title}</h1>
        <p className="mt-4 leading-7 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

function AdminNav({
  icon,
  label,
  active,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-3 py-3 text-sm transition-colors ${active ? "bg-[#3B4432] text-white" : "text-white/75 hover:bg-white/10 hover:text-white"} disabled:cursor-not-allowed disabled:opacity-35`}
    >
      {icon}
      {label}
    </button>
  );
}

function EditorPanel({
  entity,
  editor,
  setEditor,
  busy,
  onSave,
  onUpload,
  onUploadApplications,
  onUploadArticleImage,
}: {
  entity: CmsEntityType;
  editor: EditorState;
  setEditor: React.Dispatch<React.SetStateAction<EditorState | null>>;
  busy: boolean;
  onSave: (event: React.FormEvent) => Promise<void>;
  onUpload: (file: File) => Promise<void>;
  onUploadApplications: (files: File[]) => Promise<void>;
  onUploadArticleImage: (file: File) => Promise<string>;
}) {
  const update = (key: keyof EditorState, value: string) =>
    setEditor((current) => (current ? { ...current, [key]: value } : current));
  const updateApplicationImages = (next: string[]) =>
    setEditor((current) =>
      current ? { ...current, applicationImageUrls: next } : current,
    );
  const moveApplicationImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= editor.applicationImageUrls.length) return;
    const next = [...editor.applicationImageUrls];
    [next[index], next[target]] = [next[target], next[index]];
    updateApplicationImages(next);
  };
  let structuredContent: Record<string, unknown> | null = null;
  let productApplications: ApplicationIndexEntry[] = [];
  let parsedAdvanced: Record<string, unknown> | null = null;
  try {
    parsedAdvanced = JSON.parse(editor.advancedJson || "{}") as Record<
      string,
      unknown
    >;
  } catch {
    parsedAdvanced = null;
  }
  if (PAGE_ENTITIES.has(entity)) {
    structuredContent = parsedAdvanced;
  }
  if (entity === "products" && Array.isArray(parsedAdvanced?.applicationIndex)) {
    productApplications = parsedAdvanced.applicationIndex as ApplicationIndexEntry[];
  }
  const updateProductApplications = (applications: ApplicationIndexEntry[]) => {
    if (!parsedAdvanced) return;
    update(
      "advancedJson",
      JSON.stringify({ ...parsedAdvanced, applicationIndex: applications }, null, 2),
    );
  };
  const entityName =
    entity === "products"
      ? "product"
      : entity === "blog"
        ? "blog post"
        : entity === "projects"
          ? "project"
          : "page";
  return (
    <div className="fixed inset-0 z-[1010] flex justify-end bg-black/20">
      <form
        onSubmit={onSave}
        className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl">
            {editor.id ? "Edit" : "Add"} {entityName}
          </h2>
          <button
            type="button"
            onClick={() => setEditor(null)}
            aria-label="Close editor"
          >
            <X size={22} />
          </button>
        </div>
        <div className="mt-8 space-y-5">
          <Field label="Name / title">
            <input
              required
              value={editor.title}
              onChange={(event) => {
                update("title", event.target.value);
                if (!editor.id)
                  update("slug", slugifyCmsValue(event.target.value));
              }}
              className="admin-input"
            />
          </Field>
          <Field label="Slug">
            <input
              required
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              value={editor.slug}
              onChange={(event) =>
                update("slug", slugifyCmsValue(event.target.value))
              }
              className="admin-input"
            />
          </Field>
          {entity === "products" || entity === "projects" ? (
            <Field label={entity === "products" ? "Material" : "Category"}>
              <input
                required
                value={editor.secondaryLabel}
                onChange={(event) =>
                  update("secondaryLabel", event.target.value)
                }
                className="admin-input"
              />
            </Field>
          ) : !PAGE_ENTITIES.has(entity) ? (
            <Field label="Categories (comma separated)">
              <input
                value={editor.categories}
                onChange={(event) => update("categories", event.target.value)}
                className="admin-input"
              />
            </Field>
          ) : null}
          <Field label="Status">
            <select
              value={editor.status}
              onChange={(event) => update("status", event.target.value)}
              className="admin-input"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          {!PAGE_ENTITIES.has(entity) ? (
            <Field
              label={
                entity === "products"
                  ? "Summary"
                  : entity === "projects"
                    ? "Description"
                    : "Excerpt"
              }
            >
              <textarea
                rows={4}
                value={editor.summary}
                onChange={(event) => update("summary", event.target.value)}
                className="admin-input py-3"
              />
            </Field>
          ) : null}
          {entity === "products" ? (
            <ProductSpecificationsEditor
              value={productApplications}
              onChange={updateProductApplications}
            />
          ) : null}
          {entity === "blog" ? (
            <div>
              <div className="text-xs uppercase tracking-[0.12em] text-gray-500">
                Article content
              </div>
              <p className="mb-3 mt-2 text-xs leading-5 text-gray-500">
                Write and format the article visually. Preview uses the same typography as the public blog page.
              </p>
              <BlogRichTextEditor
                key={editor.id ?? editor.slug ?? "new-blog"}
                html={editor.bodyHtml}
                json={editor.bodyJson}
                onUploadImage={onUploadArticleImage}
                onChange={(bodyHtml, bodyJson) =>
                  setEditor((current) =>
                    current ? { ...current, bodyHtml, bodyJson } : current,
                  )
                }
              />
            </div>
          ) : null}
          <Field label={entity === "products" ? "Product photo" : "Image"}>
            {editor.imageUrl ? (
              <img
                src={editor.imageUrl}
                alt="Current upload"
                className="mb-3 aspect-[16/9] w-full object-cover"
              />
            ) : null}
            <label className="inline-flex cursor-pointer items-center gap-2 border border-[#D8D2C8] px-4 py-3 text-sm">
              <Upload size={16} /> Upload {entity === "products" ? "product photo" : "image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void onUpload(file);
                }}
              />
            </label>
          </Field>
          {entity === "products" ? (
            <Field label="Application photos">
              <p className="mb-3 text-xs leading-5 text-gray-500">
                Add one or more installed-project photos. The first appears on product-card hover; all appear after the product photo in the detail gallery.
              </p>
              {editor.applicationImageUrls.length > 0 ? (
                <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {editor.applicationImageUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="border border-[#D8D2C8] p-2">
                      <img src={url} alt={`Application ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                      <div className="mt-2 flex flex-wrap gap-1 text-[10px] uppercase tracking-[0.08em]">
                        <button type="button" disabled={index === 0} onClick={() => moveApplicationImage(index, -1)} className="border px-2 py-1 disabled:opacity-30" aria-label={`Move application photo ${index + 1} earlier`}>Earlier</button>
                        <button type="button" disabled={index === editor.applicationImageUrls.length - 1} onClick={() => moveApplicationImage(index, 1)} className="border px-2 py-1 disabled:opacity-30" aria-label={`Move application photo ${index + 1} later`}>Later</button>
                        <button type="button" onClick={() => updateApplicationImages(editor.applicationImageUrls.filter((_, itemIndex) => itemIndex !== index))} className="border border-red-200 px-2 py-1 text-red-700" aria-label={`Remove application photo ${index + 1}`}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
              <label className="inline-flex cursor-pointer items-center gap-2 border border-[#D8D2C8] px-4 py-3 text-sm">
                <Upload size={16} /> Upload application photos
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="sr-only"
                  onChange={(event) => {
                    const files = Array.from(event.target.files ?? []);
                    if (files.length) void onUploadApplications(files);
                    event.target.value = "";
                  }}
                />
              </label>
            </Field>
          ) : null}
          {structuredContent ? (
            <section>
              <h3 className="mb-4 font-serif text-2xl">Page sections</h3>
              <StructuredContentEditor
                value={structuredContent as never}
                onChange={(value) =>
                  update("advancedJson", JSON.stringify(value, null, 2))
                }
              />
            </section>
          ) : null}
          <details className="border border-[#D8D2C8] p-4">
            <summary className="cursor-pointer text-sm font-medium">
              Advanced JSON
            </summary>
            <p className="mt-2 text-xs leading-5 text-gray-500">
              The structured fields above and this JSON stay synchronized.
              Invalid JSON cannot be saved.
            </p>
            <textarea
              rows={14}
              value={editor.advancedJson}
              onChange={(event) => update("advancedJson", event.target.value)}
              className="admin-input mt-3 py-3 font-mono text-xs"
            />
          </details>
        </div>
        <div className="sticky bottom-0 mt-8 flex gap-3 border-t border-[#E6E0D8] bg-white py-5">
          <button
            disabled={busy}
            className="flex h-12 flex-1 items-center justify-center bg-[#283020] text-xs uppercase tracking-[0.12em] text-white disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Save changes"
            )}
          </button>
          <button
            type="button"
            onClick={() => setEditor(null)}
            className="h-12 border border-[#D8D2C8] px-6 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs uppercase tracking-[0.12em] text-gray-500">
      <span>{label}</span>
      <div className="mt-2 normal-case tracking-normal text-[#1A1C18]">
        {children}
      </div>
    </label>
  );
}

function PasswordPanel({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 8) return setMessage("Use at least 8 characters.");
    if (password !== confirm) return setMessage("Passwords do not match.");
    setBusy(true);
    const { error } = await getSupabaseBrowserClient().auth.updateUser({
      password,
    });
    setBusy(false);
    if (error) setMessage(error.message);
    else setMessage("Password updated successfully.");
  };
  return (
    <div className="fixed inset-0 z-[1020] grid place-items-center bg-black/30 p-5">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white p-7 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl">Change password</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close password panel"
          >
            <X />
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          Choose a unique password with at least 8 characters.
        </p>
        <div className="mt-7 space-y-5">
          <Field label="New password">
            <input
              type="password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="admin-input"
            />
          </Field>
          <Field label="Confirm password">
            <input
              type="password"
              minLength={8}
              required
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
              className="admin-input"
            />
          </Field>
        </div>
        {message ? (
          <p role="status" className="mt-4 text-sm text-gray-700">
            {message}
          </p>
        ) : null}
        <button
          disabled={busy}
          className="mt-7 h-12 w-full bg-[#283020] text-xs uppercase tracking-[0.12em] text-white disabled:opacity-60"
        >
          {busy ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}

function UserManagementPanel({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selected, setSelected] = useState<CmsEntityType[]>(["blog"]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setBusy(true);
    const { data, error } = await getSupabaseBrowserClient().functions.invoke(
      "manage-cms-users",
      { method: "GET" },
    );
    setBusy(false);
    if (error) setMessage(error.message);
    else setUsers((data?.users ?? []) as ManagedUser[]);
  }, []);
  useEffect(() => {
    let active = true;
    void getSupabaseBrowserClient()
      .functions.invoke("manage-cms-users", { method: "GET" })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) setMessage(error.message);
        else setUsers((data?.users ?? []) as ManagedUser[]);
      });
    return () => {
      active = false;
    };
  }, []);
  const toggle = (module: CmsEntityType) =>
    setSelected((current) =>
      current.includes(module)
        ? current.filter((item) => item !== module)
        : [...current, module],
    );
  const createUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { error } = await getSupabaseBrowserClient().functions.invoke(
      "manage-cms-users",
      { body: { email, password, permissions: selected } },
    );
    setBusy(false);
    if (error) setMessage(error.message);
    else {
      setEmail("");
      setPassword("");
      setMessage(
        "User created. Ask them to change the temporary password after signing in.",
      );
      await load();
    }
  };
  const updatePermissions = async (
    user: ManagedUser,
    next: CmsEntityType[],
  ) => {
    setBusy(true);
    const { error } = await getSupabaseBrowserClient().functions.invoke(
      "manage-cms-users",
      { method: "PUT", body: { userId: user.id, permissions: next } },
    );
    setBusy(false);
    setMessage(error ? error.message : "Permissions updated.");
    if (!error) await load();
  };
  const deleteUser = async (user: ManagedUser) => {
    if (!window.confirm(`Delete account ${user.email}?`)) return;
    setBusy(true);
    const { error } = await getSupabaseBrowserClient().functions.invoke(
      "manage-cms-users",
      { method: "DELETE", body: { userId: user.id } },
    );
    setBusy(false);
    setMessage(error ? error.message : "Account deleted.");
    if (!error) await load();
  };
  return (
    <div className="fixed inset-0 z-[1020] flex justify-end bg-black/30">
      <div className="h-full w-full max-w-3xl overflow-y-auto bg-[#F8F5F1] p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-4xl">Users & permissions</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create editor accounts and choose exactly which content they can
              manage.
            </p>
          </div>
          <button onClick={onClose} aria-label="Close user management">
            <X />
          </button>
        </div>
        <form
          onSubmit={createUser}
          className="mt-8 border border-[#D8D2C8] bg-white p-5"
        >
          <h3 className="flex items-center gap-2 font-serif text-2xl">
            <UserPlus size={20} /> Add editor
          </h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Email">
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="admin-input"
              />
            </Field>
            <Field label="Temporary password">
              <input
                type="password"
                minLength={6}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="admin-input"
              />
            </Field>
          </div>
          <PermissionChecks selected={selected} onToggle={toggle} />
          <button
            disabled={busy || selected.length === 0}
            className="mt-5 h-11 bg-[#283020] px-5 text-xs uppercase tracking-[0.12em] text-white disabled:opacity-50"
          >
            Create editor
          </button>
        </form>
        {message ? (
          <p
            role="status"
            className="mt-4 border-l-2 border-[#758267] bg-white px-4 py-3 text-sm"
          >
            {message}
          </p>
        ) : null}
        <div className="mt-6 space-y-3">
          {users.map((user) => (
            <div key={user.id} className="border border-[#D8D2C8] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{user.email}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {user.superAdmin ? "Super admin · all modules" : "Editor"}
                  </div>
                </div>
                {!user.superAdmin ? (
                  <button
                    disabled={busy}
                    onClick={() => void deleteUser(user)}
                    className="inline-flex items-center gap-2 text-sm text-red-700"
                  >
                    <Trash2 size={15} /> Delete account
                  </button>
                ) : null}
              </div>
              {!user.superAdmin ? (
                <PermissionChecks
                  selected={user.permissions}
                  onToggle={(module) => {
                    const next = user.permissions.includes(module)
                      ? user.permissions.filter((item) => item !== module)
                      : [...user.permissions, module];
                    void updatePermissions(user, next);
                  }}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PermissionChecks({
  selected,
  onToggle,
}: {
  selected: CmsEntityType[];
  onToggle: (module: CmsEntityType) => void;
}) {
  return (
    <fieldset className="mt-5">
      <legend className="text-xs uppercase tracking-[0.12em] text-gray-500">
        Content permissions
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {ALL_ENTITIES.map((module) => (
          <label
            key={module}
            className={`cursor-pointer border px-3 py-2 text-sm ${selected.includes(module) ? "border-[#283020] bg-[#E8EEE1]" : "border-[#D8D2C8]"}`}
          >
            <input
              type="checkbox"
              checked={selected.includes(module)}
              onChange={() => onToggle(module)}
              className="mr-2"
            />
            {ENTITY_LABELS[module]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
