import type { ParticipantStatus } from "@/lib/types";

const styles: Record<ParticipantStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800"
};

export function ParticipantStatusBadge({ status }: { status: ParticipantStatus }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {status[0] + status.slice(1).toLowerCase()}
    </span>
  );
}
