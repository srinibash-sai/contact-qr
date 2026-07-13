import { useEffect, useRef, useState } from "react";
import QR from "qrcode";

export function QRCode({
  value,
  size = 320,
  className,
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !value) return;
    QR.toCanvas(c, value, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#0b0b12", light: "#ffffff" },
    })
      .then(() => {
        // qrcode sets inline width/height in px which prevents responsive sizing.
        c.style.width = "";
        c.style.height = "";
      })
      .catch((e: Error) => setErr(e.message));
  }, [value, size]);

  if (err)
    return <div className="text-destructive text-sm">QR error: {err}</div>;
  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height: "auto", maxWidth: size }}
      aria-label="QR code"
    />
  );
}

export async function qrToPngDataUrl(
  value: string,
  size = 1024,
): Promise<string> {
  return QR.toDataURL(value, {
    width: size,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#0b0b12", light: "#ffffff" },
  });
}
