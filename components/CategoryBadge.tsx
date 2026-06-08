import { Coffee, Dumbbell, GraduationCap, Landmark, Map, Martini, Utensils, Sparkles } from "lucide-react";

const iconMap = {
  Food: Utensils,
  Cafe: Coffee,
  Drinks: Martini,
  Study: GraduationCap,
  Trip: Map,
  Culture: Landmark,
  Sports: Dumbbell,
  Other: Sparkles
};

export function CategoryBadge({ category }: { category: string }) {
  const Icon = iconMap[category as keyof typeof iconMap] ?? Sparkles;

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-leaf">
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {category}
    </span>
  );
}
