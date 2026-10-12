// Saytın əsas ünvanı (SEO, sitemap, paylaşma şəkli üçün)
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

// Əlaqə forması və terminaldakı "hire-me" bu ünvana göndərir
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwlvnkke";
