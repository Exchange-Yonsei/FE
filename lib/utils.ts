export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatCostRange(min: number | null, max: number | null) {
  if (min === null && max === null) return "Flexible";
  if (min !== null && max === null) return `From KRW ${min.toLocaleString()}`;
  if (min === null && max !== null) return `Up to KRW ${max.toLocaleString()}`;
  return `KRW ${min!.toLocaleString()}-${max!.toLocaleString()}`;
}
