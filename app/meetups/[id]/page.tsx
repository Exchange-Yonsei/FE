import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { CalendarClock, MapPin, Users } from "lucide-react";
import { CategoryBadge } from "@/components/CategoryBadge";
import { JoinRequestForm } from "@/components/JoinRequestForm";
import { MeetupStatusBadge } from "@/components/MeetupStatusBadge";
import { getPublicMeetup } from "@/lib/data";
import { formatCostRange, formatDateTime } from "@/lib/utils";

export default async function MeetupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const meetup = await getPublicMeetup(id);
  if (!meetup) notFound();

  const isFull = meetup.approved_count >= meetup.max_participants;
  const disabled = meetup.status === "CLOSED" || isFull || meetup.id.startsWith("mock-");

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_24rem]">
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryBadge category={meetup.category} />
          <MeetupStatusBadge status={meetup.status} isFull={isFull} />
        </div>
        <h1 className="mt-5 text-3xl font-black leading-tight text-ink">{meetup.title}</h1>
        <div className="mt-5 rounded-2xl bg-mint p-4 text-sm font-semibold leading-6 text-emerald-900">
          This is a small meetup hosted by a Yonsei student. Request to join, and the host will review your profile. If approved, you'll receive the private WhatsApp link.
        </div>
        <p className="mt-4 whitespace-pre-line text-base leading-8 text-stone-700">{meetup.description}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Info icon={<MapPin className="h-4 w-4" />} label="Location" value={meetup.location} />
          <Info icon={<CalendarClock className="h-4 w-4" />} label="Starts" value={formatDateTime(meetup.starts_at)} />
          <Info icon={<Users className="h-4 w-4" />} label="Participants" value={`${meetup.approved_count}/${meetup.max_participants} approved`} />
          <Info label="Estimated cost" value={formatCostRange(meetup.estimated_cost_min, meetup.estimated_cost_max)} />
          <Info label="Language" value={meetup.language} />
          <Info label="Host" value={meetup.host_name} />
        </div>
        {meetup.additional_notes ? (
          <div className="mt-6 rounded-2xl bg-stone-50 p-4">
            <h2 className="font-bold text-ink">Additional notes</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">{meetup.additional_notes}</p>
          </div>
        ) : null}
        <div className="mt-6">
          <h2 className="text-lg font-black text-ink">Approved participants</h2>
          {meetup.approvedParticipants.length ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {meetup.approvedParticipants.map((participant) => (
                <li key={participant.name} className="rounded-full bg-mint px-3 py-1 text-sm font-semibold text-leaf">
                  {participant.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-stone-600">No approved participants yet.</p>
          )}
        </div>
      </section>
      <aside>
        <JoinRequestForm meetupId={meetup.id} disabled={disabled} />
        {meetup.id.startsWith("mock-") ? (
          <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">Mock meetups are examples. Connect Supabase to create real requests.</p>
        ) : null}
      </aside>
    </main>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-stone-50 p-4">
      <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stone-500">
        {icon ? <span className="text-leaf">{icon}</span> : null}
        {label}
      </dt>
      <dd className="mt-2 font-semibold text-ink">{value}</dd>
    </div>
  );
}
