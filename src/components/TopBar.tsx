import { ChevronLeft, Moon, QrCode as QrIcon, Sun, Users } from "lucide-react";

export function TopBar({
  dark,
  onToggleTheme,
  onProfiles,
  showBack,
  onBack,
}: {
  dark: boolean;
  onToggleTheme: () => void;
  onProfiles?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-b from-background via-background/85 to-transparent pt-[env(safe-area-inset-top)] pb-3">
      <div className="glass mx-3 mt-3 flex items-center justify-between rounded-full px-3 py-2 transition-all duration-300">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              onClick={onBack}
              className="grid h-9 w-9 place-items-center rounded-full transition-all duration-200 hover:bg-secondary active:scale-90 animate-in fade-in-0 slide-in-from-left-2"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary transition-transform hover:rotate-6">
              <QrIcon className="h-5 w-5" />
            </div>
          )}
          <span className="font-display text-base font-semibold">ContactQR</span>
        </div>
        <div className="flex items-center gap-1">
          {onProfiles && (
            <button
              onClick={onProfiles}
              className="grid h-9 w-9 place-items-center rounded-full transition-all duration-200 hover:bg-secondary hover:scale-110 active:scale-90"
              aria-label="Profiles"
            >
              <Users className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={onToggleTheme}
            className="group grid h-9 w-9 place-items-center overflow-hidden rounded-full transition-all duration-200 hover:bg-secondary active:scale-90"
            aria-label="Toggle theme"
          >
            <span
              key={dark ? "sun" : "moon"}
              className="inline-flex animate-in fade-in-0 zoom-in-50 spin-in-180 duration-300"
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
