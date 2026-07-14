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
      const [oh, om] = openTime.split(":").map(Number);
      const [ch, cm] = closeTime.split(":").map(Number);
      const start = oh + (om || 0) / 60;
      const end = ch + (cm || 0) / 60;
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
