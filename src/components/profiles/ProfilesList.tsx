import { Copy, Plus, Trash2, Upload } from "lucide-react";

import { emptyProfile, type Profile } from "@/lib/db";
import { fullName, parseVCard } from "@/lib/vcard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfilesList({
  profiles,
  activeId,
  onSelect,
  onNew,
  onDuplicate,
  onDelete,
  onImport,
}: {
  profiles: Profile[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onImport: (p: Profile) => void;
}) {
  const handleImport = async (file: File) => {
    const text = await file.text();
    const partial = parseVCard(text);
    const p: Profile = { ...emptyProfile("Imported"), ...partial };
    onImport(p);
  };

  return (
    <div className="pt-2 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Profiles</h1>
        <div className="flex items-center gap-2">
          <label className="flex h-10 cursor-pointer items-center gap-1 rounded-full bg-secondary px-3 text-sm transition hover:bg-secondary/80 active:scale-95">
            <Upload className="h-4 w-4" /> .vcf
            <input
              type="file"
              accept=".vcf,text/vcard"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImport(f);
              }}
            />
          </label>
          <Button
            onClick={onNew}
            className="h-10 rounded-full transition-all duration-200 hover:shadow-elevated active:scale-95"
          >
            <Plus className="mr-1 h-4 w-4" /> New
          </Button>
        </div>
      </div>

      <ul className="space-y-2">
        {profiles.map((p, i) => {
          const active = p.id === activeId;
          return (
            <li
              key={p.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl bg-card p-3 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated animate-in fade-in-0 slide-in-from-bottom-2",
                active && "ring-2 ring-primary",
              )}
              style={{
                animationDelay: `${i * 50}ms`,
                animationFillMode: "backwards",
              }}
            >
              <button
                onClick={() => onSelect(p.id)}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent font-display text-primary-foreground transition-transform duration-200 hover:scale-105 hover:rotate-3">
                  {(fullName(p) || p.name || "?").slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="truncate font-semibold">{p.name}</div>
                    {active && (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary animate-in fade-in-0 zoom-in-75">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="truncate text-sm text-muted-foreground">
                    {fullName(p) || "Unnamed"}
                    {p.company ? ` · ${p.company}` : ""}
                  </div>
                </div>
              </button>
              <button
                onClick={() => onDuplicate(p.id)}
                className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition hover:bg-secondary active:scale-90"
                aria-label="Duplicate"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${p.name}"?`)) onDelete(p.id);
                }}
                className="grid h-9 w-9 place-items-center rounded-full text-destructive transition hover:bg-destructive/10 active:scale-90"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
