import { ChevronLeft, Moon, QrCode as QrIcon, Sun, Users } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MotionButton } from "@/components/shared/MotionButton";

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
            <MotionButton
              onClick={onBack}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
            </MotionButton>
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-primary transition-transform hover:rotate-6">
              <QrIcon className="h-5 w-5" />
            </div>
          )}
          <span className="font-display text-base font-semibold">
            ContactQR
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onProfiles && (
            <MotionButton
              onClick={onProfiles}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
              aria-label="Profiles"
            >
              <Users className="h-5 w-5" />
            </MotionButton>
          )}
          <MotionButton
            onClick={onToggleTheme}
            className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full hover:bg-secondary"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={dark ? "sun" : "moon"}
                initial={{ y: -18, rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ y: 0, rotate: 0, opacity: 1, scale: 1 }}
                exit={{ y: 18, rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="absolute inline-flex"
              >
                {dark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </motion.span>
            </AnimatePresence>
          </MotionButton>
        </div>
      </div>
    </header>
  );
}
