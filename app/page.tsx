import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Trophy, Zap, Calendar, TrendingUp } from "lucide-react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { LandingHeader } from "@/components/landing/LandingHeader";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  const features = [
    {
      icon: Trophy,
      title: "Earn XP & Level Up",
      description: "Complete habits to earn experience points and level up. Watch your progress grow with every achievement.",
      delay: 100,
    },
    {
      icon: Zap,
      title: "Build Streaks",
      description: "Maintain your momentum with streak tracking. Keep your habits consistent and watch your streak grow.",
      delay: 200,
    },
    {
      icon: Calendar,
      title: "Track Daily & Weekly",
      description: "Set up daily or weekly habits. Track your progress with an intuitive calendar view and completion history.",
      delay: 300,
    },
    {
      icon: TrendingUp,
      title: "Visualize Progress",
      description: "See your improvement over time with beautiful charts and heatmaps. Understand your patterns and optimize your routine.",
      delay: 400,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <div id="hero">
        <HeroSection />
      </div>

      {/* Dashboard Preview Section */}
      <section id="preview" className="container mx-auto px-4 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="animate-in fade-in slide-in-from-bottom duration-700 delay-200 mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
              See HabitZen in Action
            </h2>
            <p className="animate-in fade-in duration-700 delay-300 text-lg text-muted-foreground sm:text-xl md:text-2xl">
              A beautiful, intuitive dashboard designed to keep you motivated
            </p>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-400 relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-border/50 bg-card/50 shadow-2xl shadow-indigo-500/10">
            <div className="relative aspect-video w-full">
              <Image
                src="/dashboard-overview.png"
                alt="HabitZen Dashboard Preview"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="animate-in fade-in slide-in-from-bottom duration-700 delay-200 mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
              Everything you need to build better habits
            </h2>
            <p className="animate-in fade-in duration-700 delay-300 text-lg text-muted-foreground sm:text-xl md:text-2xl">
              Powerful features designed to help you stay consistent and motivated
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="animate-in fade-in slide-in-from-bottom duration-700"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="cta" className="border-t bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-gray-900/50 dark:via-indigo-950/50 dark:to-purple-950/50">
        <div className="container mx-auto px-4 py-12 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
                Ready to transform your habits?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:text-2xl">
                Join HabitZen today and start your journey towards a better you. It&apos;s free to get started.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-14 items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-10 text-base font-medium text-white ring-offset-background transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto sm:text-lg"
                >
                  Create Account
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-14 items-center justify-center rounded-md border-2 border-indigo-600 bg-background px-10 text-base font-medium text-indigo-600 ring-offset-background transition-all duration-200 hover:bg-indigo-50 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950/20 w-full sm:w-auto sm:text-lg"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
