import { useEffect } from "react";
import { X } from "lucide-react";
import { QRCode } from "@/components/QRCode";

export function FullscreenQR({
  value,
  name,
  onClose,
}: {
  value: string;
  name: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-white p-6 animate-in fade-in-0 duration-200"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-black/10 text-black transition-all duration-200 hover:bg-black/20 hover:rotate-90 active:scale-90"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>
      <div
        className="text-center animate-in zoom-in-90 fade-in-0 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-3xl bg-white p-2">
          <QRCode
            value={value}
            size={Math.min(560, Math.floor(window.innerWidth - 48))}
          />
        </div>
        <div className="mt-6 font-display text-xl font-bold text-black">
          {name}
        </div>
        <div className="mt-1 text-sm text-black/60">Scan to save contact</div>
      </div>
    </div>
  );
}
