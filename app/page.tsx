import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white">
          HabitZen
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Transforme seus hábitos em conquistas. Rastreie, complete e evolua.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="rounded-lg border-2 border-indigo-600 px-6 py-3 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-900/20 transition-colors"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  );
}

