import { db } from "@portfolio/db";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

/**
 * Creates the tRPC context for a request.
 * Retrieves cookies, headers, Supabase auth sessions, and IP address.
 */
export async function createTRPCContext() {
  const reqHeaders = await headers();
  const reqCookies = await cookies();

  // Retrieve client IP for rate limiting
  const ip =
    reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    reqHeaders.get("x-real-ip") ||
    "127.0.0.1";

  // Initialize Supabase Server Client for Next.js App Router
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        getAll() {
          return reqCookies.getAll();
        },
        setAll(cookiesToSet: any) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) =>
              reqCookies.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );

  // Retrieve user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    db,
    session,
    supabase,
    ip,
    headers: reqHeaders,
  };
}

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
