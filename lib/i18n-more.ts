import type { Lang } from "./i18n";

// Canlı status, retro rejim, QR vizitkart, tab başlığı və /cv səhifəsinin mətnləri
export type More = {
  status: { inBaku: string; online: string; evening: string; sleeping: string; weekend: string };
  tab: { away: string; welcomeBack: string };
  retro: { on: string; off: string };
  qr: { button: string; title: string; hint: string; download: string; close: string };
  cv: { print: string; back: string; summary: string; contact: string; hint: string };
};

export const more: Record<Lang, More> = {
  az: {
    status: {
      inBaku: "Bakıda saat",
      online: "Onlayn — adətən 2 saat ərzində cavab verirəm",
      evening: "Axşamdır — sabah səhər cavab verəcəm",
      sleeping: "Yatıram 😴 — səhər cavab verəcəm",
      weekend: "Həftə sonu — bazar ertəsi cavab verəcəm",
    },
    tab: { away: "Gəl qayıt 🥺", welcomeBack: "Yenidən xoş gəldin 👋" },
    retro: { on: "🕹️ Retro rejim aktivdir — çıxmaq üçün kodu təkrar daxil et", off: "Retro rejim söndürüldü" },
    qr: {
      button: "QR vizitkart",
      title: "Kontaktlarına əlavə et",
      hint: "Telefonun kamerası ilə skan et — kontakt avtomatik yaradılacaq.",
      download: ".vcf yüklə",
      close: "Bağla",
    },
    cv: {
      print: "Çap et / PDF saxla",
      back: "← Sayta qayıt",
      summary: "Haqqımda",
      contact: "Əlaqə",
      hint: "Bu səhifə çap üçün hazırlanıb: ⌘P / Ctrl+P → “PDF kimi saxla”.",
    },
  },
  en: {
    status: {
      inBaku: "Local time in Baku",
      online: "Online — I usually reply within 2 hours",
      evening: "It's evening — I'll reply tomorrow morning",
      sleeping: "Sleeping 😴 — I'll reply in the morning",
      weekend: "Weekend — I'll reply on Monday",
    },
    tab: { away: "Come back 🥺", welcomeBack: "Welcome back 👋" },
    retro: { on: "🕹️ Retro mode on — enter the code again to exit", off: "Retro mode off" },
    qr: {
      button: "QR business card",
      title: "Add to your contacts",
      hint: "Scan with your phone camera — the contact is created automatically.",
      download: "Download .vcf",
      close: "Close",
    },
    cv: {
      print: "Print / Save as PDF",
      back: "← Back to site",
      summary: "Summary",
      contact: "Contact",
      hint: "This page is print-ready: ⌘P / Ctrl+P → “Save as PDF”.",
    },
  },
  ru: {
    status: {
      inBaku: "Время в Баку",
      online: "Онлайн — обычно отвечаю в течение 2 часов",
      evening: "Вечер — отвечу завтра утром",
      sleeping: "Сплю 😴 — отвечу утром",
      weekend: "Выходные — отвечу в понедельник",
    },
    tab: { away: "Вернись 🥺", welcomeBack: "С возвращением 👋" },
    retro: { on: "🕹️ Ретро-режим включён — введите код ещё раз, чтобы выйти", off: "Ретро-режим выключен" },
    qr: {
      button: "QR-визитка",
      title: "Добавить в контакты",
      hint: "Отсканируйте камерой телефона — контакт создастся автоматически.",
      download: "Скачать .vcf",
      close: "Закрыть",
    },
    cv: {
      print: "Печать / Сохранить PDF",
      back: "← Вернуться на сайт",
      summary: "О себе",
      contact: "Контакты",
      hint: "Страница готова к печати: ⌘P / Ctrl+P → «Сохранить как PDF».",
    },
  },
};
