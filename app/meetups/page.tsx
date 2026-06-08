import Link from "next/link";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { MeetupCard } from "@/components/MeetupCard";
import { categories } from "@/lib/types";
import { getPublicMeetups } from "@/lib/data";

export default async function MeetupsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; sort?: string; open?: string }>;
}) {
  const params = await searchParams;
  const meetups = await getPublicMeetups();

  const filtered = meetups
    .filter((meetup) => !params.category || params.category === "All" || meetup.category === params.category)
    .filter((meetup) => {
      if (params.open !== "1") return true;
      return meetup.status === "OPEN" && meetup.approved_count < meetup.max_participants;
    })
    .sort((a, b) => {
      const direction = params.sort === "latest" ? -1 : 1;
      return (new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()) * direction;
    });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-ink">Browse Meetups</h1>
          <p className="mt-2 text-stone-600">Find people to eat with near Yonsei.</p>
        </div>
        <Link className="btn-primary" href="/meetups/new">
          <Plus className="h-4 w-4" aria-hidden />
          Create Meetup
        </Link>
      </div>
      <form className="mt-6 grid gap-3 rounded-3xl border border-stone-200 bg-white p-4 shadow-soft sm:grid-cols-3">
        <label className="block space-y-2">
          <span className="label">Category</span>
          <select className="field" name="category" defaultValue={params.category ?? "All"}>
            <option>All</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="label">Date</span>
          <select className="field" name="sort" defaultValue={params.sort ?? "soonest"}>
            <option value="soonest">Soonest first</option>
            <option value="latest">Latest first</option>
          </select>
        </label>
        <div className="flex items-end gap-3">
          <label className="flex h-12 flex-1 items-center gap-3 rounded-2xl border border-stone-200 px-4 text-sm font-semibold">
            <input name="open" value="1" type="checkbox" defaultChecked={params.open === "1"} />
            Open only
          </label>
          <button className="btn-secondary h-12 px-5 py-0" type="submit">
            Apply
          </button>
        </div>
      </form>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((meetup) => (
          <MeetupCard key={meetup.id} meetup={meetup} />
        ))}
      </div>
      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No meetups found" description="Try another category or show closed meetups too." href="/meetups/new" action="Create Meetup" />
        </div>
      ) : null}
    </main>
  );
}
