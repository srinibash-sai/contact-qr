import type { ReactNode } from "react";

export function IconAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-1 rounded-2xl bg-secondary/60 py-3 text-secondary-foreground transition-all duration-200 hover:bg-secondary hover:-translate-y-0.5 hover:shadow-soft active:scale-95"
    >
      <span className="transition-transform duration-200 group-hover:scale-110">{icon}</span>
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  );
}
