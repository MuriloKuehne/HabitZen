import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[95vh] flex-col items-center justify-center overflow-hidden px-4 py-12 sm:py-24">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.2),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-5xl space-y-6 sm:space-y-10 text-center">
        <h1 className="animate-in slide-in-from-top duration-700 delay-100 text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
            HabitZen
          </span>
        </h1>
        <p className="animate-in fade-in duration-700 delay-200 text-lg text-gray-600 dark:text-gray-300 sm:text-xl md:text-2xl lg:text-3xl">
          Transform your habits into achievements. Track, complete, and evolve.
        </p>
        <p className="animate-in fade-in duration-700 delay-300 text-base text-gray-500 dark:text-gray-400 sm:text-lg md:text-xl">
          Gamify your daily routines with XP, levels, and streaks. Build better habits, one day at a time.
        </p>
        <div className="animate-in fade-in duration-700 delay-400 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex h-14 items-center justify-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-10 text-base font-medium text-white ring-offset-background transition-all duration-200 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 w-full sm:w-auto sm:text-lg"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex h-14 items-center justify-center rounded-md border-2 border-indigo-600 bg-background px-10 text-base font-medium text-indigo-600 ring-offset-background transition-all duration-200 hover:bg-indigo-50 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950/20 w-full sm:w-auto sm:text-lg"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}

