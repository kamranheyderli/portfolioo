# Kamran Heyderli — Portfolio

Personal portfolio of **Kamran Heyderli**, Front-end Engineer from Baku, Azerbaijan.

Built with **Next.js**, **React**, **TypeScript**, **Three.js (React Three Fiber)** and **Framer Motion**.

## Features

- Interactive 3D scene, custom cursor, magnetic buttons, smooth scroll (Lenis)
- Three languages (AZ / EN / RU) and light / dark theme
- Contact form via Formspree with an animated thank-you card
- Synthesized UI sound effects (Web Audio API) with a mute toggle
- `⌘K` terminal with commands and mini apps: `hire-me`, `snake`, `typing`, `matrix`, `neofetch`, `resume`
- Live Baku time & availability status, QR business card (vCard)
- Printable CV page at `/cv`
- Konami code easter egg (↑↑↓↓←→←→BA)
- SEO: Open Graph image, sitemap, robots, JSON-LD

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the production URL (used for SEO and the share image).
