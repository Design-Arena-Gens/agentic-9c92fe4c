import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moleskin Journal Admin Panel",
  description: "Inventory and sales management for Moleskin journals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
