import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { MeetupHostActions, ParticipantActions, RemoveParticipantAction } from "@/components/DashboardActions";
import { ParticipantStatusBadge } from "@/components/ParticipantStatusBadge";
import { getHostMeetups } from "@/lib/data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

export default async function DashboardPage() {
  if (!hasSupabaseEnv()) redirect("/login");

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login");

  const meetups = await getHostMeetups();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-ink">Host Dashboard</h1>
          <p className="mt-2 text-stone-600">Manage your created meetups and join requests.</p>
        </div>
        <Link className="btn-primary" href="/meetups/new">
          Create Meetup
        </Link>
      </div>
      <div className="mt-6 space-y-5">
        {meetups.map((meetup) => {
          const pending = meetup.participants.filter((participant) => participant.status === "PENDING");
          const approved = meetup.participants.filter((participant) => participant.status === "APPROVED");
          const rejected = meetup.participants.filter((participant) => participant.status === "REJECTED");
          const hasParticipants = meetup.participants.length > 0;

          return (
            <article key={meetup.id} className="rounded-3xl border border-blue-soft bg-white p-5 shadow-soft">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <Link className="text-2xl font-black text-ink hover:text-yonsei-secondary" href={`/dashboard/meetups/${meetup.id}`}>
                    {meetup.title}
                  </Link>
                  <p className="mt-2 text-sm text-stone-600">{meetup.location} · {formatDateTime(meetup.starts_at)}</p>
                  <p className="mt-2 text-sm font-semibold text-yonsei-secondary">{approved.length}/{meetup.max_participants} joined · {meetup.status === "CLOSED" ? "Closed" : "Open"}</p>
                </div>
                <MeetupHostActions meetupId={meetup.id} status={meetup.status} />
              </div>
              <div className="mt-5 rounded-2xl bg-yonsei-light p-4">
                <p className="text-sm font-bold text-yonsei-secondary">Private WhatsApp link</p>
                <p className="mt-1 break-all text-sm text-ink">{meetup.whatsapp_link}</p>
              </div>
              {hasParticipants ? (
                <>
                  <RequestGroup title="Join requests" participants={pending} meetupId={meetup.id} showActions />
                  <RequestGroup title="Joined participants" participants={approved} meetupId={meetup.id} showRemoveAction />
                  <RequestGroup title="Removed participants" participants={rejected} meetupId={meetup.id} />
                </>
              ) : (
                <p className="mt-5 text-sm text-stone-500">No participants yet.</p>
              )}
            </article>
          );
        })}
      </div>
      {meetups.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="No hosted meetups yet" description="Create your first casual plan for Yonsei students." href="/meetups/new" action="Create Meetup" />
        </div>
      ) : null}
    </main>
  );
}

function RequestGroup({
  title,
  participants,
  meetupId,
  showActions = false,
  showRemoveAction = false
}: {
  title: string;
  participants: Array<{
    id: string;
    name: string;
    nationality: string | null;
    short_message: string | null;
    contact_info: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED";
  }>;
  meetupId: string;
  showActions?: boolean;
  showRemoveAction?: boolean;
}) {
  if (!participants.length) return null;

  return (
    <section className="mt-5">
      <h2 className="text-sm font-black uppercase tracking-wide text-stone-500">{title}</h2>
      <div className="mt-3 grid gap-3">
        {participants.map((participant) => (
          <div key={participant.id} className="rounded-2xl border border-blue-soft p-4">
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
              {showActions ? <ParticipantActions participantId={participant.id} meetupId={meetupId} /> : null}
              {showRemoveAction ? <RemoveParticipantAction participantId={participant.id} meetupId={meetupId} /> : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
