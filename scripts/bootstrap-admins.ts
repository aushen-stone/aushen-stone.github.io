import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
const initialPassword = process.env.INITIAL_ADMIN_PASSWORD;
const emails = ["dave@aushenstone.com.au", "maggie@aushenstone.com.au"];

if (!url || !serviceRole || !initialPassword) {
  throw new Error("Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and INITIAL_ADMIN_PASSWORD.");
}

const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });

for (const email of emails) {
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: initialPassword,
    email_confirm: true,
  });

  let user = created.user;
  if (createError?.message.toLowerCase().includes("already")) {
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (error) throw error;
    user = data.users.find((candidate) => candidate.email?.toLowerCase() === email) ?? null;
  } else if (createError) {
    throw createError;
  }

  if (!user) throw new Error(`Unable to find or create ${email}`);
  // This is an explicit one-off bootstrap command, so an existing target account
  // receives the requested temporary password as well.
  if (createError) {
    const { error: passwordError } = await supabase.auth.admin.updateUserById(user.id, {
      password: initialPassword,
      email_confirm: true,
    });
    if (passwordError) throw passwordError;
  }
  const { error: grantError } = await supabase
    .from("admin_users")
    .upsert({ user_id: user.id }, { onConflict: "user_id" });
  if (grantError) throw grantError;
  console.log(`Super admin ready: ${email}`);
}
