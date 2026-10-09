import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/set-password";

  if (code) {
    const forwardResponse = NextResponse.redirect(`${origin}${next}`);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            cookiesToSet.forEach(({ name, value, options }) => forwardResponse.cookies.set(name, value, options));
          },
        },
      });

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return forwardResponse;
      }
    }
  }

  // If there's an error or no code found, forward to /admin/set-password so the client can display the explanation
  return NextResponse.redirect(`${origin}/admin/set-password?error=Invalid+or+expired+link`);
}
