import { formatTime12h } from "@/lib/utils";

type Props = {
  businessName: string;
  phone: string;
  openTime: string;
  closeTime: string;
  openDays: string;
};

export function Footer({ businessName, phone, openTime, closeTime, openDays }: Props) {
  return (
    <footer className="site-footer">
      <h3>{businessName}</h3>
      <p>Phone: {phone}</p>
      <p>
        Timings: {openDays}, {formatTime12h(openTime)} – {formatTime12h(closeTime)}
      </p>
      <p style={{ marginTop: 16, fontSize: 12, color: "#888" }}>
        © {new Date().getFullYear()} {businessName}. All rights reserved.
      </p>
    </footer>
  );
}
