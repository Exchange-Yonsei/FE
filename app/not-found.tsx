import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="rounded-3xl border border-blue-soft bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-black text-ink">Page not found</h1>
        <p className="mt-3 text-stone-600">This meetup or request may not exist anymore.</p>
        <Link className="btn-primary mt-6" href="/meetups">
          Browse Meetups
        </Link>
      </div>
    </main>
  );
}
