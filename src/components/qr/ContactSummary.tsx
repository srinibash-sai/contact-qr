import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Profile } from "@/lib/db";

export function ContactSummary({
  profile,
  vcard,
}: {
  profile: Profile;
  vcard: string;
}) {
  const [copied, setCopied] = useState(false);

  const fields = (
    [
      ["Mobile", profile.mobile],
      ["Work", profile.workPhone],
      ["Email", profile.email],
      ["Website", profile.website],
      [
        "Address",
        [
          profile.street,
          profile.city,
          profile.state,
          profile.zip,
          profile.country,
        ]
          .filter(Boolean)
          .join(", "),
      ],
    ] as [string, string][]
  ).filter(([, v]) => v);

  if (!fields.length) return null;

  return (
    <div className="mt-4 rounded-3xl bg-card p-4 shadow-soft transition-shadow hover:shadow-elevated">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Contact details
        </div>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(vcard);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground transition hover:bg-secondary active:scale-90"
        >
          <span
            key={copied ? "y" : "n"}
            className="inline-flex animate-in fade-in-0 zoom-in-75 duration-200"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-primary" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </span>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <dl className="space-y-1.5">
        {fields.map(([k, v], i) => (
          <div
            key={k}
            className="flex justify-between gap-4 text-sm animate-in fade-in-0 slide-in-from-right-1"
            style={{
              animationDelay: `${i * 40}ms`,
              animationFillMode: "backwards",
            }}
          >
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="truncate text-right">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
