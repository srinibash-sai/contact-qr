import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { Profile } from "@/lib/db";
import { buildVCard } from "@/lib/vcard";
import { QRCode } from "@/components/QRCode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, Section } from "@/components/shared/Field";

const formatPhone = (v: string) => v.replace(/[^\d+\s()-]/g, "").slice(0, 24);

const validateProfile = (p: Profile) => {
  const e: Record<string, string> = {};
  if (p.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))
    e.email = "Invalid email";
  if (
    p.website &&
    !/^https?:\/\/.+\..+/.test(p.website) &&
    !/^[\w-]+(\.[\w-]+)+/.test(p.website)
  )
    e.website = "Invalid URL";
  return e;
};

export function EditForm({
  initial,
  onSave,
  onCancel,
  onDelete,
}: {
  initial: Profile;
  onSave: (p: Profile) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => Promise<void>;
}) {
  const [p, setP] = useState<Profile>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const vcard = useMemo(() => buildVCard(p), [p]);
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setP((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="pt-2 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Edit profile
          </div>
          <h1 className="font-display text-2xl font-bold">
            {p.name || "Untitled"}
          </h1>
        </div>
      </div>

      <div className="mb-4 rounded-3xl bg-card p-4 shadow-soft transition-shadow hover:shadow-elevated">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-white p-2 transition-transform hover:scale-105">
            <QRCode value={vcard} size={96} />
          </div>
          <div className="min-w-0 text-sm">
            <div className="font-semibold">Live preview</div>
            <div className="text-muted-foreground">
              Your QR updates as you type. Scan to confirm before saving.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-3xl bg-card p-5 shadow-soft">
        <Section title="Profile">
          <Field label="Profile label">
            <Input
              value={p.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Identity">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <Input
                value={p.firstName}
                onChange={(e) => set("firstName", e.target.value)}
              />
            </Field>
            <Field label="Last name">
              <Input
                value={p.lastName}
                onChange={(e) => set("lastName", e.target.value)}
              />
            </Field>
            <Field label="Company">
              <Input
                value={p.company}
                onChange={(e) => set("company", e.target.value)}
              />
            </Field>
            <Field label="Job title">
              <Input
                value={p.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Contact">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Mobile">
              <Input
                inputMode="tel"
                value={p.mobile}
                onChange={(e) => set("mobile", formatPhone(e.target.value))}
              />
            </Field>
            <Field label="Work phone">
              <Input
                inputMode="tel"
                value={p.workPhone}
                onChange={(e) => set("workPhone", formatPhone(e.target.value))}
              />
            </Field>
            <Field label="Fax">
              <Input
                inputMode="tel"
                value={p.fax}
                onChange={(e) => set("fax", formatPhone(e.target.value))}
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                value={p.email}
                onChange={(e) => set("email", e.target.value.trim())}
              />
            </Field>
            <div className="col-span-2">
              <Field label="Website" error={errors.website}>
                <Input
                  type="url"
                  value={p.website}
                  onChange={(e) => set("website", e.target.value.trim())}
                  placeholder="https://"
                />
              </Field>
            </div>
          </div>
        </Section>

        <Section title="Address">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Field label="Street">
                <Input
                  value={p.street}
                  onChange={(e) => set("street", e.target.value)}
                />
              </Field>
            </div>
            <Field label="City">
              <Input
                value={p.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </Field>
            <Field label="State">
              <Input
                value={p.state}
                onChange={(e) => set("state", e.target.value)}
              />
            </Field>
            <Field label="ZIP">
              <Input
                value={p.zip}
                onChange={(e) => set("zip", e.target.value)}
              />
            </Field>
            <Field label="Country">
              <Input
                value={p.country}
                onChange={(e) => set("country", e.target.value)}
              />
            </Field>
          </div>
        </Section>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          className="h-12 rounded-2xl transition active:scale-95"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          className="h-12 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-elevated transition-all duration-200 hover:brightness-110 hover:shadow-lg active:scale-[0.98]"
          onClick={() => {
            const e = validateProfile(p);
            setErrors(e);
            if (Object.keys(e).length) {
              toast.error("Please fix the highlighted fields");
              return;
            }
            onSave(p);
          }}
        >
          Save
        </Button>
      </div>

      {onDelete && (
        <button
          onClick={async () => {
            if (confirm("Delete this profile? This cannot be undone."))
              await onDelete();
          }}
          className="mx-auto mt-6 flex items-center gap-2 rounded-full px-4 py-2 text-sm text-destructive transition hover:bg-destructive/10 active:scale-95"
        >
          <Trash2 className="h-4 w-4" /> Delete profile
        </button>
      )}
    </div>
  );
}
