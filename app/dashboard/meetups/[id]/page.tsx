import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { MeetupHostActions, ParticipantActions, RemoveParticipantAction } from "@/components/DashboardActions";
import { ParticipantStatusBadge } from "@/components/ParticipantStatusBadge";
import { getHostMeetup } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatCostRange, formatDateTime } from "@/lib/utils";

export default async function HostMeetupPage({ params }: { params: Promise<{ id: string }> }) {
  if (!hasSupabaseEnv()) redirect("/login");

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const { id } = await params;
  const meetup = await getHostMeetup(id);
  if (!meetup) notFound();
  const joinedParticipants = meetup.participants.filter((participant) => participant.status === "APPROVED");

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link className="text-sm font-bold text-leaf" href="/dashboard">Back to dashboard</Link>
      <section className="mt-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-ink">{meetup.title}</h1>
            <p className="mt-2 text-stone-600">{meetup.location} · {formatDateTime(meetup.starts_at)}</p>
          </div>
          <MeetupHostActions meetupId={meetup.id} status={meetup.status} />
        </div>
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          <Info label="Category" value={meetup.category} />
          <Info label="Language" value={meetup.language} />
          <Info label="Joined participants" value={`${joinedParticipants.length}/${meetup.max_participants}`} />
          <Info label="Estimated cost" value={formatCostRange(meetup.estimated_cost_min, meetup.estimated_cost_max)} />
          <Info label="WhatsApp link" value={meetup.whatsapp_link ?? ""} />
          <Info label="Status" value={meetup.status === "CLOSED" ? "Closed" : "Open"} />
        </dl>
        <p className="mt-6 whitespace-pre-line leading-7 text-stone-700">{meetup.description}</p>
      </section>
      <section className="mt-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-black text-ink">Participants</h2>
        <div className="mt-4 grid gap-3">
          {meetup.participants.map((participant) => (
            <div key={participant.id} className="rounded-2xl border border-stone-200 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink">{participant.name}</p>
                    <ParticipantStatusBadge status={participant.status} />
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{participant.nationality || "Nationality not provided"}</p>
                  {participant.short_message ? <p className="mt-2 text-sm leading-6 text-stone-700">{participant.short_message}</p> : null}
                  {participant.contact_info ? <p className="mt-2 text-sm font-semibold text-stone-700">Contact: {participant.contact_info}</p> : null}
                </div>
                {participant.status === "PENDING" ? <ParticipantActions participantId={participant.id} meetupId={meetup.id} /> : null}
                {participant.status === "APPROVED" ? <RemoveParticipantAction participantId={participant.id} meetupId={meetup.id} /> : null}
              </div>
            </div>
          ))}
        </div>
        {meetup.participants.length === 0 ? <p className="mt-3 text-sm text-stone-600">No requests yet.</p> : null}
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-stone-50 p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="mt-2 break-words font-semibold text-ink">{value}</dd>
    </div>
  );
}
