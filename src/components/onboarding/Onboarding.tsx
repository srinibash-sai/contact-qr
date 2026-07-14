import { useState } from "react";
import { QrCode as QrIcon, Smartphone, Sparkles } from "lucide-react";
import { toast } from "sonner";

import type { Profile } from "@/lib/db";
import { useInstallPrompt } from "@/lib/pwa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/shared/Field";
import { validateOnboardingInput } from "@/lib/validation";
import { InstallGuide } from "./InstallGuide";

export function Onboarding({
  onCreate,
}: {
  onCreate: (p: Partial<Profile>) => Promise<void>;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<"firstName" | "lastName" | "email" | "mobile", string>>
  >({});
  const { canPrompt, installed, promptInstall, platform } = useInstallPrompt();
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  const empty = !firstName && !lastName && !email && !mobile;

  return (
    <div className="pt-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-elevated transition-transform duration-500 hover:scale-105 hover:rotate-3">
          <QrIcon className="h-10 w-10" />
        </div>
        <h1 className="font-display text-3xl font-bold">
          Your digital business card
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          Instantly share your contact info with a QR code. Private, offline, no
          account.
        </p>
      </div>

      {!installed && (
        <div className="glass mt-6 flex items-center gap-3 rounded-2xl p-3 transition-all duration-300 hover:shadow-soft">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">Install ContactQR</div>
            <div className="truncate text-xs text-muted-foreground">
              One-tap access from your home screen.
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="transition active:scale-95"
            onClick={async () => {
              if (canPrompt) {
                await promptInstall();
              } else {
                setShowInstallGuide(true);
              }
            }}
          >
            Install
          </Button>
        </div>
      )}

      {showInstallGuide && (
        <InstallGuide
          platform={platform}
          onClose={() => setShowInstallGuide(false)}
        />
      )}

      <div className="mt-6 rounded-3xl bg-card p-5 shadow-soft transition-shadow duration-300 hover:shadow-elevated">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <h2 className="font-display text-lg font-semibold">
            Create your first profile
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" error={errors.firstName}>
            <Input
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setErrors((prev) => ({ ...prev, firstName: undefined }));
              }}
              placeholder="Jane"
            />
          </Field>
          <Field label="Last name" error={errors.lastName}>
            <Input
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setErrors((prev) => ({ ...prev, lastName: undefined }));
              }}
              placeholder="Doe"
            />
          </Field>
          <div className="col-span-2">
            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="jane@example.com"
              />
            </Field>
          </div>
          <div className="col-span-2">
            <Field label="Mobile" error={errors.mobile}>
              <Input
                type="tel"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  setErrors((prev) => ({ ...prev, mobile: undefined }));
                }}
                placeholder="+1 555 123 4567"
              />
            </Field>
          </div>
        </div>

        <Button
          className="mt-5 h-12 w-full rounded-2xl bg-linear-to-r from-primary to-accent text-primary-foreground shadow-elevated transition-all duration-200 hover:shadow-lg hover:brightness-110 active:scale-[0.98] disabled:opacity-60"
          disabled={saving || empty}
          onClick={async () => {
            const result = validateOnboardingInput({
              firstName,
              lastName,
              email,
              mobile,
            });

            if (!result.ok) {
              setErrors(result.errors);
              toast.error("Please fix the highlighted fields");
              return;
            }

            setSaving(true);
            try {
              await onCreate({
                name: "Personal",
                ...result.data,
              });
            } finally {
              setSaving(false);
            }
          }}
        >
          {saving ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
              Generating…
            </span>
          ) : (
            "Generate my QR code"
          )}
        </Button>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          You can add more details later.
        </p>
      </div>
    </div>
  );
}
