import Link from "next/link";

export function EmptyState({
  title,
  description,
  href,
  action
}: {
  title: string;
  description: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-white/75 p-8 text-center">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm text-stone-600">{description}</p>
      {href && action ? (
        <Link className="btn-primary mt-5" href={href}>
          {action}
        </Link>
      ) : null}
    </div>
  );
}
