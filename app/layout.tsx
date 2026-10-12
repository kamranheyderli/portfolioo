import type { Metadata } from "next";
import { Space_Grotesk, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/LangProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { IntroProvider } from "@/components/Preloader";
import { introInitScript, themeInitScript } from "@/lib/initScripts";
import SmoothScroll from "@/components/SmoothScroll";
import { profile } from "@/lib/data";
import { siteUrl } from "@/lib/site";

// Space Grotesk-də kiril yoxdur: rus hərfləri Manrope ilə göstərilir
const display = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-display", adjustFontFallback: false });
const displayCyr = Manrope({ subsets: ["cyrillic"], weight: ["600", "700", "800"], variable: "--font-display-cyr" });
const body = Inter({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-body" });

const title = `${profile.name} — ${profile.role}`;
const description =
  "Front-end Engineer with 3+ years of experience building fast, scalable and user-centered web apps with React, Next.js and TypeScript. Baku, Azerbaijan.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: ["Kamran Heyderli", "Front-end Engineer", "Front-end Developer", "React", "Next.js", "TypeScript", "Baku", "Azerbaijan"],
  authors: [{ name: profile.name, url: siteUrl }],
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", title, description, siteName: profile.name, locale: "az_AZ", alternateLocale: ["en_US", "ru_RU"] },
  twitter: { card: "summary_large_image", title, description },
};

// Google üçün strukturlaşdırılmış məlumat
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  url: siteUrl,
  image: `${siteUrl}${profile.photo}`,
  address: { "@type": "PostalAddress", addressLocality: "Baku", addressCountry: "AZ" },
  sameAs: profile.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
  knowsAbout: ["React", "Next.js", "TypeScript", "Redux", "Micro-Frontend"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" data-theme="dark" suppressHydrationWarning className={`${display.variable} ${displayCyr.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript + ";" + introInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </head>
      <body>
        <ThemeProvider>
          <LangProvider>
            <IntroProvider>
              <SmoothScroll />
              {children}
            </IntroProvider>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
