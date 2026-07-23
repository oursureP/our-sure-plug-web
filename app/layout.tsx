import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "OurSurePlug",
    template: "%s | OurSurePlug",
  },
  description:
    "OurSurePlug Business Management Platform — Digital Services and Training",
  keywords: [
    "digital services",
    "training",
    "web development",
    "Port Harcourt",
    "Social media management",
    "Video Editing",
    "Youtube Management",
    "Ai",
    "Online Advertisement",
  ],
  authors: [{ name: "OurSurePlug" }],
  creator: "OurSurePlug",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://oursureplug.com",
    siteName: "OurSurePlug",
    title: "OurSurePlug — Digital Services and Training",
    description: "OurSurePlug Business Management Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "OurSurePlug",
    description: "OurSurePlug Business Management Platform",
    creator: "OurSurePlug",
    site: "https://oursureplug.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
