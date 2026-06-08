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
      ? "bg-stone-200 text-stone-700"
      : isFull
        ? "bg-sky text-blue-800"
        : "bg-emerald-100 text-emerald-800";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}>{label}</span>;
}
