/*
 * One-time bootstrap: makes an existing Supabase Auth user the dashboard's
 * first Administrator. After that, everyone else is invited from
 * Settings → Users & roles, never through this script.
 *
 * Usage (from the project folder):
 *   node --env-file=.env.local scripts/make-admin.mjs <email> "<Full Name>" <department> [office]
 *
 *   department: career-services-operations | business-formalisation-compliance
 *   office:     "Buea, Cameroon" (default) | "Stafford, TX"
 *
 * Uses the service-role key from .env.local, so run it only on a trusted
 * machine. It needs supabase/006_testimonial_publishing.sql to have been run first.
 */
import { createClient } from "@supabase/supabase-js";

const [email, name, department, location = "Buea, Cameroon"] = process.argv.slice(2);
const DEPARTMENTS = ["career-services-operations", "business-formalisation-compliance"];

if (!email || !name || !DEPARTMENTS.includes(department)) {
  console.error('Usage: node --env-file=.env.local scripts/make-admin.mjs <email> "<Full Name>" <career-services-operations|business-formalisation-compliance> ["Buea, Cameroon"|"Stafford, TX"]');
  process.exit(1);
}
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set — run with --env-file=.env.local");
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Find the Auth user by email (paged, in case there are many).
let user;
for (let page = 1; !user; page++) {
  const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
  if (error) {
    console.error("Couldn't list sign-in accounts:", error.message);
    process.exit(1);
  }
  user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (data.users.length < 200) break;
}
if (!user) {
  console.error(`No sign-in account exists for ${email}. Create it in Supabase → Authentication → Users first.`);
  process.exit(1);
}

const { error } = await supabase.from("staff_profiles").upsert({
  id: user.id,
  name,
  email: email.toLowerCase(),
  role: "administrator",
  department,
  location,
  languages: ["English"],
  active: true,
});
if (error) {
  console.error("Couldn't create the staff profile:", error.message);
  if (/permission denied/i.test(error.message)) console.error("→ Run supabase/006_testimonial_publishing.sql in the Supabase SQL editor first.");
  process.exit(1);
}

console.log(`${name} (${email}) is now an Administrator. Sign in at /admin.`);
