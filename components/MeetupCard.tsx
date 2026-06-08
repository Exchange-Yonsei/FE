import Link from "next/link";
import { CalendarClock, MapPin, Users } from "lucide-react";
import type { PublicMeetup } from "@/lib/types";
import { CategoryBadge } from "@/components/CategoryBadge";
import { MeetupStatusBadge } from "@/components/MeetupStatusBadge";
import { formatCostRange, formatDateTime } from "@/lib/utils";

export function MeetupCard({ meetup }: { meetup: PublicMeetup }) {
  const isFull = meetup.approved_count >= meetup.max_participants;

  return (
    <article className="flex h-full flex-col rounded-3xl border border-stone-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <CategoryBadge category={meetup.category} />
        <MeetupStatusBadge status={meetup.status} isFull={isFull} />
      </div>
      <Link href={`/meetups/${meetup.id}`} className="mt-4 text-xl font-black leading-tight text-ink hover:text-leaf">
        {meetup.title}
      </Link>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">{meetup.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Korean Host", "Small Group", "English Friendly"].map((badge) => (
          <span key={badge} className="rounded-full bg-mint px-3 py-1 text-xs font-bold text-leaf">
            {badge}
          </span>
        ))}
      </div>
      <div className="mt-5 space-y-2 text-sm text-stone-700">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-leaf" aria-hidden />
          {meetup.location}
        </p>
        <p className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-leaf" aria-hidden />
          {formatDateTime(meetup.starts_at)}
        </p>
        <p className="flex items-center gap-2">
          <Users className="h-4 w-4 text-leaf" aria-hidden />
          {meetup.approved_count}/{meetup.max_participants} joined
        </p>
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-stone-50 p-3">
          <dt className="text-xs font-semibold text-stone-500">Language</dt>
          <dd className="mt-1 font-semibold text-ink">{meetup.language}</dd>
        </div>
        <div className="rounded-2xl bg-stone-50 p-3">
          <dt className="text-xs font-semibold text-stone-500">Estimated cost</dt>
          <dd className="mt-1 font-semibold text-ink">{formatCostRange(meetup.estimated_cost_min, meetup.estimated_cost_max)}</dd>
        </div>
      </dl>
      <div className="mt-auto flex items-center justify-between pt-5">
        <span className="text-sm text-stone-600">Hosted by {meetup.host_name}</span>
        <Link className="text-sm font-bold text-leaf hover:text-emerald-800" href={`/meetups/${meetup.id}`}>
          View
        </Link>
      </div>
    </article>
  );
}
