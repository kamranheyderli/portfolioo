import type { Metadata } from "next";
import { Space_Grotesk, Inter, Manrope, Pixelify_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { LangProvider } from "@/components/LangProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { IntroProvider } from "@/components/Preloader";
import { introInitScript, themeInitScript } from "@/lib/initScripts";
import SmoothScroll from "@/components/SmoothScroll";
import Toaster from "@/components/Toaster";
import KonamiRetro from "@/components/KonamiRetro";
import TabPresence from "@/components/TabPresence";
import { profile } from "@/lib/data";
import { siteUrl } from "@/lib/site";

// Space Grotesk-də kiril yoxdur: rus hərfləri Manrope ilə göstərilir
const display = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-display", adjustFontFallback: false });
const displayCyr = Manrope({ subsets: ["cyrillic"], weight: ["600", "700", "800"], variable: "--font-display-cyr" });
const body = Inter({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-body" });
// Yalnız retro rejimdə (Konami kodu) istifadə olunur — əvvəlcədən yüklənmir
const pixel = Pixelify_Sans({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-pixel", preload: false });

const title = `${profile.name} — ${profile.role}`;
// Ad təsvirin əvvəlində: Google axtarış nəticəsində bu mətni göstərir
const description =
  "Kamran Heyderli — Front-end Engineer from Baku, Azerbaijan with 3+ years of experience building fast, scalable and user-centered web apps with React, Next.js and TypeScript.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: ["Kamran Heyderli", "Kamran Heydarli", "Kamran Heydərli", "Front-end Engineer", "Front-end Developer", "React", "Next.js", "TypeScript", "Baku", "Azerbaijan"],
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
  // Adın digər yazılışları — insanlar fərqli variantlarla axtara bilər
  alternateName: ["Kamran Heydarli", "Kamran Heydərli"],
  description,
  jobTitle: profile.role,
  worksFor: { "@type": "Organization", name: "IkTex" },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Sumqayıt Dövlət Universiteti" },
    { "@type": "EducationalOrganization", name: "Ingress Academy" },
    { "@type": "EducationalOrganization", name: "Garage Academy" },
  ],
  email: `mailto:${profile.email}`,
  url: siteUrl,
  image: `${siteUrl}${profile.photo}`,
  address: { "@type": "PostalAddress", addressLocality: "Baku", addressCountry: "AZ" },
  sameAs: profile.socials.filter((s) => s.href.startsWith("http")).map((s) => s.href),
  knowsAbout: ["React", "Next.js", "TypeScript", "Redux", "Micro-Frontend"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: profile.name,
  alternateName: ["Kamran Heyderli Portfolio", "kamranheyderli.is-a.dev"],
  url: siteUrl,
  inLanguage: ["az", "en", "ru"],
  author: { "@type": "Person", name: profile.name, url: siteUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az" data-theme="dark" suppressHydrationWarning className={`${display.variable} ${displayCyr.variable} ${body.variable} ${pixel.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript + ";" + introInitScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body>
        <ThemeProvider>
          <LangProvider>
            <IntroProvider>
              <SmoothScroll />
              {children}
              <Toaster />
              <KonamiRetro />
              <TabPresence />
            </IntroProvider>
          </LangProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
