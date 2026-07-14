import slugify from "slugify";

export function toSlug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true });
}

export function formatInr(amount: number | string) {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function whatsappLink(phone: string, text?: string) {
  const digits = phone.replace(/\D/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

export function siteUrl(path = "") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function isStoreOpen(openTime: string, closeTime: string, now = new Date()) {
  const parseHourMin = (str: string, defaultHour: number) => {
    if (!str) return defaultHour * 60;
    const s = str.trim().toLowerCase();
    let hVal = defaultHour;
    let mVal = 0;
    if (s.includes(":")) {
      const parts = s.split(":");
      hVal = parseInt(parts[0], 10);
      mVal = parseInt(parts[1], 10) || 0;
    } else if (s.length === 4 && !isNaN(Number(s))) {
      hVal = parseInt(s.slice(0, 2), 10);
      mVal = parseInt(s.slice(2), 10);
    } else {
      hVal = parseInt(s, 10);
    }
    if (s.includes("pm") && hVal < 12) hVal += 12;
    if (s.includes("am") && hVal === 12) hVal = 0;
    return (isNaN(hVal) ? defaultHour : hVal) * 60 + mVal;
  };
  const mins = now.getHours() * 60 + now.getMinutes();
  return mins >= parseHourMin(openTime, 10) && mins < parseHourMin(closeTime, 20);
}

export function formatTime12h(timeInput?: string | null) {
  if (!timeInput) return "10am";
  const str = String(timeInput).trim();
  if (/^10:?00(:?00)?\s*(am)?$/i.test(str) || str === "1000") return "10am";
  if (/^20:?00(:?00)?\s*(pm)?$/i.test(str) || str === "2000" || /^0?8:?00(:?00)?\s*pm$/i.test(str)) return "8pm";
  if (/am|pm/i.test(str)) return str.toLowerCase().replace(/\s+/g, "");
  const clean = str.replace(":", "");
  const h = Number(clean.slice(0, clean.length > 2 ? clean.length - 2 : clean.length));
  const m = clean.length > 2 ? Number(clean.slice(-2)) : 0;
  if (isNaN(h)) return str;
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour}${period}` : `${hour}:${String(m).padStart(2, "0")}${period}`;
}
