interface ActivityItem {
  time: string;
  title: string;
  meta: string;
  status: "ok" | "warning" | "info";
}

const statusColor: Record<ActivityItem["status"], string> = {
  ok: "bg-emerald-400",
  warning: "bg-orange-400",
  info: "bg-sky-400",
};

interface ActivityTimelineProps {
  items: ActivityItem[];
}

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(4,7,18,0.65)]">
      <p className="text-xs uppercase tracking-[0.3em] text-white/50">Fluxo do dia</p>
      <p className="text-lg font-semibold text-white">Atividades</p>
      <div className="mt-6 space-y-5">
        {items.map((item) => (
          <div key={item.time} className="flex gap-4">
            <div className="text-xs text-white/60">{item.time}</div>
            <div className="relative flex-1">
              <span className={`absolute -left-4 top-2 h-2.5 w-2.5 rounded-full ${statusColor[item.status]}`}></span>
              <p className="text-sm font-semibold text-white">{item.title}</p>
              <p className="text-xs text-white/60">{item.meta}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
