export function MeetupStatusBadge({
  status,
  isFull
}: {
  status: "OPEN" | "CLOSED";
  isFull: boolean;
}) {
  const label = status === "CLOSED" ? "Closed" : isFull ? "Full" : "Open";
  const style =
    status === "CLOSED"
      ? "border border-blue-soft bg-stone-100 text-stone-700"
      : isFull
        ? "border border-blue-soft bg-sky text-yonsei-primary"
        : "border border-blue-soft bg-yonsei-light text-yonsei-primary";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}>{label}</span>;
}
