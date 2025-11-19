import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="mx-auto max-w-4xl space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white animate-in slide-in-from-top duration-700 delay-100">
          HabitZen
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 animate-in fade-in duration-700 delay-200">
          Transform your habits into achievements. Track, complete, and evolve.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in duration-700 delay-300">
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="rounded-lg border-2 border-indigo-600 px-6 py-3 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-900/20 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

