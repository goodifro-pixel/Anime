import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Увійти",
  description: "Увійдіть у свій обліковий запис AniHub.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-bg-border bg-bg-soft p-8 shadow-glow">
        <h1 className="text-2xl font-bold text-white">Вхід в AniHub</h1>
        <p className="mt-1 text-sm text-gray-400">
          У цьому демо-клоні авторизація ще не підключена. Підключіть будь-який
          провайдер (NextAuth, Clerk, Supabase, власний бекенд) — форма готова.
        </p>
        <form className="mt-6 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-gray-300">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="rounded-xl border border-bg-border bg-bg px-4 py-2.5 text-sm outline-none ring-brand/40 focus:ring-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-gray-300">Пароль</span>
            <input
              type="password"
              placeholder="••••••••"
              className="rounded-xl border border-bg-border bg-bg px-4 py-2.5 text-sm outline-none ring-brand/40 focus:ring-2"
            />
          </label>
          <button
            type="button"
            className="mt-2 rounded-full bg-brand py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Увійти
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-500">
          Немає акаунта?{" "}
          <Link href="/login" className="text-brand hover:underline">
            Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
}
