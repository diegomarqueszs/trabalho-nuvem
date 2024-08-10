import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Customers App",
  description: "A simple customers app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-zinc-900 text-zinc-50">{children}</body>
    </html>
  );
}