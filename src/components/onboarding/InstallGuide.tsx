import { X } from "lucide-react";

export function InstallGuide({
  platform,
  onClose,
}: {
  platform: string;
  onClose: () => void;
}) {
  const steps =
    platform === "ios"
      ? [
          "Tap the Share button in Safari",
          "Scroll down and tap 'Add to Home Screen'",
          "Tap 'Add' to install ContactQR",
        ]
      : platform === "android"
        ? [
            "Tap the menu (⋮) in your browser",
            "Tap 'Install app' or 'Add to Home screen'",
            "Confirm to install ContactQR",
          ]
        : [
            "Look for the install icon in your address bar",
            "Or open your browser menu and choose 'Install ContactQR'",
            "Confirm to add it as a desktop app",
          ];

  return (
    <div className="glass mt-3 rounded-2xl p-4 animate-in fade-in-0 slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">How to install</div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1 transition hover:bg-secondary active:scale-90"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ol className="mt-2 space-y-1.5 text-sm text-muted-foreground">
        {steps.map((s, i) => (
          <li
            key={i}
            className="flex gap-2 animate-in fade-in-0 slide-in-from-left-1"
            style={{
              animationDelay: `${i * 60}ms`,
              animationFillMode: "backwards",
            }}
          >
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
