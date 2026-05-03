import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bakery Website",
  description: "A neutral foundation for the bakery website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
