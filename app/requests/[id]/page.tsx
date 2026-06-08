import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { ParticipantStatusBadge } from "@/components/ParticipantStatusBadge";
import { getRequestById } from "@/lib/data";
import { formatDateTime } from "@/lib/utils";

export default async function RequestPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ sent?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const request = await getRequestById(id);
  if (!request) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {query.sent === "1" ? (
        <div className="mb-4 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          Your request has been sent. The host will review it soon.
        </div>
      ) : null}
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <ParticipantStatusBadge status={request.status} />
          <span className="text-sm text-stone-500">Request ID: {request.id}</span>
        </div>
        <h1 className="mt-5 text-3xl font-black text-ink">{request.meetup?.title ?? "Meetup request"}</h1>
        {request.status === "PENDING" ? <p className="mt-4 text-stone-700">Waiting for host approval.</p> : null}
        {request.status === "REJECTED" ? <p className="mt-4 text-stone-700">Sorry, your request was not approved.</p> : null}
        {request.status === "APPROVED" && request.meetup ? (
          <div className="mt-5 space-y-4">
            <p className="text-stone-700">You are approved. Use the private WhatsApp link to join the group.</p>
            <a className="btn-primary w-full sm:w-auto" href={request.meetup.whatsapp_link} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" aria-hidden />
              Open WhatsApp
            </a>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Location" value={request.meetup.location} />
              <Info label="Starts" value={formatDateTime(request.meetup.starts_at)} />
              <Info label="Host" value={request.meetup.host_name} />
              <Info label="Language" value={request.meetup.language} />
            </div>
            <p className="whitespace-pre-line rounded-2xl bg-stone-50 p-4 text-sm leading-6 text-stone-700">{request.meetup.description}</p>
          </div>
        ) : null}
      </section>
      <Link className="mt-5 inline-flex text-sm font-bold text-leaf" href="/meetups">
        Browse more meetups
      </Link>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-stone-50 p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="mt-2 font-semibold text-ink">{value}</dd>
    </div>
  );
}
