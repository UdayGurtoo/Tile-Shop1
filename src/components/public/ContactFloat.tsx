"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/utils";

export function ContactFloat({
  phone,
  whatsapp,
  openTime = "10:00",
  closeTime = "20:00",
}: {
  phone: string;
  whatsapp?: string | null;
  openTime?: string;
  closeTime?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours() + now.getMinutes() / 60;
      const parseHour = (str: string, defaultHour: number) => {
        if (!str) return defaultHour;
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
        return isNaN(hVal) ? defaultHour : hVal + mVal / 60;
      };
      const start = parseHour(openTime, 10);
      const end = parseHour(closeTime, 20);
      setOpen(h >= start && h < end);
    };
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, [openTime, closeTime]);

  const wa = whatsapp || phone.replace(/\D/g, "");

  return (
    <>
      <div className="contact-controls">
        <a className="cta-btn call" href={`tel:${phone}`} aria-label="Call">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://cdn-icons-png.flaticon.com/512/724/724664.png" width={30} height={30} alt="" />
        </a>
        <a className="cta-btn whatsapp" href={whatsappLink(wa)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" width={30} height={30} alt="" />
        </a>
      </div>
      <div className="status-badge" style={{ background: open ? "#28a745" : "#dc3545" }}>
        {open ? "OPEN NOW" : "CLOSED NOW"}
      </div>
    </>
  );
}
