import { useMemo, useState } from "react";
import {
  Download,
  Maximize2,
  Pencil,
  Share2,
  Upload,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import type { Profile } from "@/lib/db";
import { buildVCard, fullName } from "@/lib/vcard";
import { QRCode, qrToPngDataUrl } from "@/components/QRCode";
import { Button } from "@/components/ui/button";
import { IconAction } from "./IconAction";
import { ContactSummary } from "./ContactSummary";
import { FullscreenQR } from "./FullscreenQR";

export function QRView({
  profile,
  profileCount,
  onEdit,
  onSwitch,
}: {
  profile: Profile;
  profileCount: number;
  onEdit: () => void;
  onSwitch: () => void;
}) {
  const vcard = useMemo(() => buildVCard(profile), [profile]);
  const [fullscreen, setFullscreen] = useState(false);
  const name = fullName(profile) || profile.name;

  const download = async () => {
    const url = await qrToPngDataUrl(vcard, 1024);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(name || "contact").replace(/\s+/g, "_")}.png`;
    a.click();
    toast.success("QR downloaded");
  };

  const share = async () => {
    const url = await qrToPngDataUrl(vcard, 1024);
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], `${name || "contact"}.png`, {
        type: "image/png",
      });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: name,
          text: `Contact: ${name}`,
        });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: name, text: `Contact: ${name}` });
        return;
      }
    } catch {
      /* fall through */
    }
    await navigator.clipboard.writeText(vcard);
    toast.success("vCard copied to clipboard");
  };

  const exportVcf = () => {
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(name || "contact").replace(/\s+/g, "_")}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-container/60 px-3 py-1 text-xs font-medium text-on-primary-container">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />{" "}
          {profile.name}
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold">
          {name || "Unnamed"}
        </h1>
        {(profile.title || profile.company) && (
          <p className="text-sm text-muted-foreground">
            {[profile.title, profile.company].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      <div className="relative mt-6">
        <div className="absolute inset-x-4 -top-6 h-24 rounded-[2rem] bg-gradient-to-br from-primary/40 to-accent/40 blur-2xl animate-pulse [animation-duration:4s]" />
        <div className="relative rounded-[2rem] bg-card p-5 shadow-elevated transition-transform duration-300 hover:-translate-y-1">
          <button
            onClick={() => setFullscreen(true)}
            className="group relative block w-full overflow-hidden rounded-2xl bg-white p-4 transition-transform duration-300 hover:scale-[1.01] active:scale-[0.99]"
            aria-label="Open full-screen QR"
          >
            <QRCode
              value={vcard}
              size={340}
              className="mx-auto h-auto w-full max-w-[340px]"
            />
            <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-110">
              <Maximize2 className="h-4 w-4" />
            </span>
          </button>

          <div className="mt-4 grid grid-cols-4 gap-2">
            <IconAction
              icon={<Share2 className="h-5 w-5" />}
              label="Share"
              onClick={share}
            />
            <IconAction
              icon={<Download className="h-5 w-5" />}
              label="PNG"
              onClick={download}
            />
            <IconAction
              icon={<Upload className="h-5 w-5" />}
              label=".vcf"
              onClick={exportVcf}
            />
            <IconAction
              icon={<Maximize2 className="h-5 w-5" />}
              label="Full"
              onClick={() => setFullscreen(true)}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          className="h-12 rounded-2xl transition active:scale-95"
          onClick={onEdit}
        >
          <Pencil className="mr-2 h-4 w-4" /> Edit profile
        </Button>
        <Button
          variant="secondary"
          className="h-12 rounded-2xl transition active:scale-95"
          onClick={onSwitch}
          disabled={profileCount < 1}
        >
          <Users className="mr-2 h-4 w-4" /> Switch
          {profileCount > 1 ? ` (${profileCount})` : ""}
        </Button>
      </div>

      <ContactSummary profile={profile} vcard={vcard} />

      {fullscreen && (
        <FullscreenQR
          value={vcard}
          onClose={() => setFullscreen(false)}
          name={name}
        />
      )}
    </div>
  );
}
