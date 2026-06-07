import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moss Demo Mock",
  description: "Local clickable demo mock of Moss integrations and documentation."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
