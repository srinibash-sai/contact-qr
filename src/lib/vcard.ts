import type { Profile } from "./db";

const esc = (v: string) =>
  (v ?? "").replace(/([\\,;])/g, "\\$1").replace(/\n/g, "\\n");

export function buildVCard(p: Profile): string {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
  lines.push(`N:${esc(p.lastName)};${esc(p.firstName)};;;`);
  lines.push(`FN:${esc(fullName(p))}`);
  if (p.company) lines.push(`ORG:${esc(p.company)}`);
  if (p.title) lines.push(`TITLE:${esc(p.title)}`);
  if (p.workPhone) lines.push(`TEL;TYPE=WORK,VOICE:${esc(p.workPhone)}`);
  if (p.mobile) lines.push(`TEL;TYPE=CELL,VOICE:${esc(p.mobile)}`);
  if (p.fax) lines.push(`TEL;TYPE=FAX:${esc(p.fax)}`);
  if (p.email) lines.push(`EMAIL;TYPE=INTERNET:${esc(p.email)}`);
  if (p.website) lines.push(`URL:${esc(p.website)}`);
  if (p.street || p.city || p.state || p.zip || p.country) {
    lines.push(
      `ADR;TYPE=WORK:;;${esc(p.street)};${esc(p.city)};${esc(p.state)};${esc(p.zip)};${esc(p.country)}`,
    );
  }
  lines.push("END:VCARD");
  return lines.join("\r\n");
}

export function fullName(p: Pick<Profile, "firstName" | "lastName">) {
  return [p.firstName, p.lastName].filter(Boolean).join(" ").trim();
}

export function parseVCard(text: string): Partial<Profile> {
  const out: Partial<Profile> = {};
  const lines = text.replace(/\r\n[ \t]/g, "").split(/\r?\n/);
  for (const raw of lines) {
    const idx = raw.indexOf(":");
    if (idx < 0) continue;
    const head = raw.slice(0, idx).toUpperCase();
    const val = raw.slice(idx + 1);
    if (head.startsWith("N")) {
      const [ln, fn] = val.split(";");
      out.lastName = out.lastName ?? ln ?? "";
      out.firstName = out.firstName ?? fn ?? "";
    } else if (head.startsWith("FN")) {
      const parts = val.split(" ");
      if (!out.firstName) out.firstName = parts[0] ?? "";
      if (!out.lastName) out.lastName = parts.slice(1).join(" ");
    } else if (head.startsWith("ORG")) out.company = val;
    else if (head.startsWith("TITLE")) out.title = val;
    else if (head.startsWith("TEL") && head.includes("CELL")) out.mobile = val;
    else if (head.startsWith("TEL") && head.includes("FAX")) out.fax = val;
    else if (head.startsWith("TEL")) out.workPhone = val;
    else if (head.startsWith("EMAIL")) out.email = val;
    else if (head.startsWith("URL")) out.website = val;
    else if (head.startsWith("ADR")) {
      const a = val.split(";");
      out.street = a[2] ?? "";
      out.city = a[3] ?? "";
      out.state = a[4] ?? "";
      out.zip = a[5] ?? "";
      out.country = a[6] ?? "";
    }
  }
  return out;
}
