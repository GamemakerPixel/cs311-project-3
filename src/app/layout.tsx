import type { Metadata } from "next";
import "./globals.css";

import Navigation from "c@/server/navigation"

export const metadata: Metadata = {
  title: "Mythical Meals",
  description: "A fantasy-style recipe generation platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-primary text-text"
      >
        <Navigation />
        <div className="mx-4">
          {children}
        </div>
      </body>
    </html>
  );
}
