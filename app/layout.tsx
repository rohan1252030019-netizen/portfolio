import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alex Mercer — Creative Developer & Designer",
  description:
    "Portfolio of Alex Mercer — a creative developer building immersive digital experiences at the intersection of design and technology.",
  keywords: ["portfolio", "creative developer", "frontend", "design", "animation"],
  authors: [{ name: "Alex Mercer" }],
  openGraph: {
    title: "Alex Mercer — Creative Developer",
    description: "Building immersive digital experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for perf */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="noise-overlay">
        {children}
      </body>
    </html>
  );
}
