import type { Metadata } from "next";
import { Mulish, Cabin } from "next/font/google";
import "./globals.css";

const mulish = Mulish({
  variable: "--font-mulish-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cabin = Cabin({
  variable: "--font-cabin-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "NitHub Talent Spotlight",
  description: "Discover, verify, and hire top tech talent trained at NitHub.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${mulish.variable} ${cabin.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-mulish bg-white text-navy selection:bg-brand-green selection:text-white">
        {children}
      </body>
    </html>
  );
}
