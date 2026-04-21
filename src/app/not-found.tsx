import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl font-black text-brand">404</div>
      <h1 className="mt-2 text-2xl font-bold text-white">Сторінку не знайдено</h1>
      <p className="mt-2 text-sm text-gray-400">
        Можливо, ви перейшли за застарілим посиланням або сторінка була
        видалена.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
      >
        На головну
      </Link>
    </div>
  );
}
