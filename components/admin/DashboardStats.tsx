import { TechnicalLabel } from "@/components/decorative/TechnicalLabel";

interface DashboardStatsProps {
  stats: { total: number; published: number; drafts: number; users: number };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const items = [
    { label: "Total Posts", value: stats.total },
    { label: "Published", value: stats.published },
    { label: "Drafts", value: stats.drafts },
    { label: "Users", value: stats.users },
  ];

  return (
    <div className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="bg-background p-6">
          <div className="font-mono text-3xl text-foreground">{item.value}</div>
          <TechnicalLabel className="mt-1">{item.label}</TechnicalLabel>
        </div>
      ))}
    </div>
  );
}
