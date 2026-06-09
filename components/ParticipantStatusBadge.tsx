import type { ParticipantStatus } from "@/lib/types";

const styles: Record<ParticipantStatus, string> = {
  PENDING: "border border-blue-soft bg-yonsei-light text-yonsei-primary",
  APPROVED: "border border-blue-soft bg-sky text-yonsei-primary",
  REJECTED: "border border-blue-soft bg-white text-stone-700"
};

export function ParticipantStatusBadge({ status }: { status: ParticipantStatus }) {
  const labels: Record<ParticipantStatus, string> = {
    PENDING: "Request sent",
    APPROVED: "Joined",
    REJECTED: "Removed"
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
