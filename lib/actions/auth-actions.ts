"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signUpSchema, signInSchema } from "@/lib/utils/validations";

export async function signUp(formData: FormData) {
  try {
    const supabase = await createClient();

    const rawFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedFields = signUpSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      return {
        error: "Invalid data",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
      },
    });

    if (error) {
      console.error("[signUp] Supabase auth error:", error.message);
      return {
        error: error.message,
      };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch (error) {
    // Next.js redirect() throws a NEXT_REDIRECT error, which is expected behavior
    // We should re-throw it to allow Next.js to handle the redirect
    if (error && typeof error === "object" && "digest" in error) {
      const nextError = error as { digest?: string };
      if (nextError.digest?.startsWith("NEXT_REDIRECT")) {
        throw error;
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error creating account";
    console.error("[signUp] Unexpected error:", errorMessage, error);
    
    return {
      error: errorMessage.includes("NEXT_REDIRECT") 
        ? "Redirecting..." 
        : `An error occurred while creating your account: ${errorMessage}`,
    };
  }
}

export async function signIn(formData: FormData) {
  try {
    const supabase = await createClient();

    const rawFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validatedFields = signInSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      return {
        error: "Invalid data",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[signIn] Supabase auth error:", error.message);
      return {
        error: error.message,
      };
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
  } catch (error) {
    // Next.js redirect() throws a NEXT_REDIRECT error, which is expected behavior
    // We should re-throw it to allow Next.js to handle the redirect
    if (error && typeof error === "object" && "digest" in error) {
      const nextError = error as { digest?: string };
      if (nextError.digest?.startsWith("NEXT_REDIRECT")) {
        throw error;
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error signing in";
    console.error("[signIn] Unexpected error:", errorMessage, error);
    
    return {
      error: errorMessage.includes("NEXT_REDIRECT") 
        ? "Redirecting..." 
        : `An error occurred while signing in: ${errorMessage}`,
    };
  }
}

export async function signInWithOAuth(provider: "google" | "github") {
  try {
    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      console.error(`[signInWithOAuth] ${provider} error:`, error.message);
      return {
        error: error.message,
      };
    }

    if (data?.url) {
      redirect(data.url);
    } else {
      return {
        error: `Failed to initiate ${provider} authentication. Please try again.`,
      };
    }
  } catch (error) {
    // Next.js redirect() throws a NEXT_REDIRECT error, which is expected behavior
    if (error && typeof error === "object" && "digest" in error) {
      const nextError = error as { digest?: string };
      if (nextError.digest?.startsWith("NEXT_REDIRECT")) {
        throw error;
      }
    }

    const errorMessage = error instanceof Error ? error.message : `Unknown error signing in with ${provider}`;
    console.error(`[signInWithOAuth] ${provider} unexpected error:`, errorMessage, error);
    
    return {
      error: `An error occurred while signing in with ${provider}: ${errorMessage}`,
    };
  }
}

export async function signOut() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
  } catch (error) {
    // Next.js redirect() throws a NEXT_REDIRECT error, which is expected behavior
    // We should re-throw it to allow Next.js to handle the redirect
    if (error && typeof error === "object" && "digest" in error) {
      const nextError = error as { digest?: string };
      if (nextError.digest?.startsWith("NEXT_REDIRECT")) {
        throw error;
      }
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error signing out";
    console.error("[signOut] Unexpected error:", errorMessage, error);
    
    // Even if signOut fails, try to redirect
    revalidatePath("/", "layout");
    redirect("/");
  }
}

