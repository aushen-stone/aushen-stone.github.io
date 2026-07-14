import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  // supabase-js adds x-client-info to browser function requests. It must be
  // accepted here or the browser blocks the request during CORS preflight.
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};
const modules = new Set(["products", "blog", "projects", "home", "services", "about"]);

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: corsHeaders });

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );
  const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: callerData, error: callerError } = await supabase.auth.getUser(token);
  if (callerError || !callerData.user) return json({ error: "unauthorized" }, 401);

  // Account and permission administration is restricted to super admins.
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", callerData.user.id)
    .maybeSingle();
  if (!admin) return json({ error: "forbidden" }, 403);

  if (request.method === "GET") {
    const { data: authData, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) return json({ error: error.message }, 400);
    const [{ data: admins }, { data: permissions }] = await Promise.all([
      supabase.from("admin_users").select("user_id"),
      supabase.from("cms_user_permissions").select("user_id,module"),
    ]);
    const adminIds = new Set((admins ?? []).map((row) => row.user_id));
    return json({
      users: authData.users.map((user) => ({
        id: user.id,
        email: user.email,
        superAdmin: adminIds.has(user.id),
        permissions: (permissions ?? []).filter((row) => row.user_id === user.id).map((row) => row.module),
        createdAt: user.created_at,
      })),
    });
  }

  const body = await request.json().catch(() => ({}));
  if (request.method === "POST") {
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const requested = Array.isArray(body.permissions) ? body.permissions.filter((item: unknown) => modules.has(String(item))) : [];
    if (!email || password.length < 6 || requested.length === 0) {
      return json({ error: "email, a 6+ character password and at least one permission are required" }, 400);
    }
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if (error || !data.user) return json({ error: error?.message ?? "user_create_failed" }, 400);
    const { error: permissionError } = await supabase.from("cms_user_permissions").insert(
      requested.map((module: string) => ({ user_id: data.user.id, module, created_by: callerData.user.id }))
    );
    if (permissionError) {
      await supabase.auth.admin.deleteUser(data.user.id);
      return json({ error: permissionError.message }, 400);
    }
    return json({ ok: true });
  }

  const userId = String(body.userId ?? "");
  if (!userId) return json({ error: "userId is required" }, 400);
  if (request.method === "PUT") {
    const requested = Array.isArray(body.permissions) ? body.permissions.filter((item: unknown) => modules.has(String(item))) : [];
    const { error: deleteError } = await supabase.from("cms_user_permissions").delete().eq("user_id", userId);
    if (deleteError) return json({ error: deleteError.message }, 400);
    if (requested.length) {
      const { error } = await supabase.from("cms_user_permissions").insert(
        requested.map((module: string) => ({ user_id: userId, module, created_by: callerData.user.id }))
      );
      if (error) return json({ error: error.message }, 400);
    }
    return json({ ok: true });
  }
  if (request.method === "DELETE") {
    if (userId === callerData.user.id) return json({ error: "cannot_delete_current_user" }, 400);
    const { error } = await supabase.auth.admin.deleteUser(userId);
    return error ? json({ error: error.message }, 400) : json({ ok: true });
  }
  return json({ error: "method_not_allowed" }, 405);
});
