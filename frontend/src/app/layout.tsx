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
      <body className="bg-gray-150 text-zinc-950 ">{children}</body>
    </html>
  );
}