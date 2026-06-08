"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteMeetup, updateMeetupStatus, updateParticipantStatus } from "@/app/actions";

export function ParticipantActions({ participantId, meetupId }: { participantId: string; meetupId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="btn-primary px-4 py-2"
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => updateParticipantStatus(participantId, "APPROVED", meetupId))}
      >
        Approve
      </button>
      <button
        className="btn-secondary px-4 py-2"
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => updateParticipantStatus(participantId, "REJECTED", meetupId))}
      >
        Reject
      </button>
    </div>
  );
}

export function RemoveParticipantAction({ participantId, meetupId }: { participantId: string; meetupId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      className="btn-secondary px-4 py-2"
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => updateParticipantStatus(participantId, "REJECTED", meetupId))}
    >
      Remove participant
    </button>
  );
}

export function MeetupHostActions({ meetupId, status }: { meetupId: string; status: "OPEN" | "CLOSED" }) {
  const [pending, startTransition] = useTransition();
  const nextStatus = status === "OPEN" ? "CLOSED" : "OPEN";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="btn-secondary px-4 py-2"
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => updateMeetupStatus(meetupId, nextStatus))}
      >
        {status === "OPEN" ? "Close Meetup" : "Reopen Meetup"}
      </button>
      <button
        className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
        type="button"
        disabled={pending}
        onClick={() => {
          if (window.confirm("Delete this meetup and all requests?")) {
            startTransition(() => deleteMeetup(meetupId));
          }
        }}
      >
        <Trash2 className="h-4 w-4" aria-hidden />
        Delete
      </button>
    </div>
  );
}
