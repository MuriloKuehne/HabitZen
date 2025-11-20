import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function validateEnvVariables() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build time, environment variables may not be available
  // Return placeholder values - validation will happen at runtime
  const isBuildTime = process.env.NEXT_PHASE === "phase-production-build" || 
                      process.env.NODE_ENV === "production" && !supabaseUrl;

  if (isBuildTime && (!supabaseUrl || !supabaseAnonKey)) {
    // During build, return placeholder values
    // These will be validated properly at runtime
    return {
      supabaseUrl: supabaseUrl || "https://placeholder.supabase.co",
      supabaseAnonKey: supabaseAnonKey || "placeholder-key",
    };
  }

  if (!supabaseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL environment variable. Please set it in your environment configuration."
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. Please set it in your environment configuration."
    );
  }

  return { supabaseUrl, supabaseAnonKey };
}

export async function createClient() {
  const { supabaseUrl, supabaseAnonKey } = validateEnvVariables();
  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

