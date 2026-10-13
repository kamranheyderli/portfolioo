import type { Lang } from "./i18n";

// Canlı status, retro rejim, QR vizitkart, tab başlığı və /cv səhifəsinin mətnləri
export type More = {
  status: { inBaku: string; online: string; evening: string; sleeping: string; weekend: string };
  tab: { away: string; welcomeBack: string };
  retro: { on: string; off: string };
  qr: { button: string; title: string; hint: string; download: string; close: string };
  cv: { print: string; back: string; summary: string; contact: string; hint: string };
  season: { novruz: string; winter: string };
  copy: { label: string; done: string };
  keys: { title: string; close: string; items: { keys: string; text: string }[] };
  ach: {
    title: string; progress: string; unlocked: string; allDone: string; locked: string;
    names: Record<AchievementId, string>; hints: Record<AchievementId, string>;
  };
  accent: { title: string; names: Record<AccentId, string> };
  music: { title: string; on: string; off: string };
};

export type AchievementId = "terminal" | "snake" | "typing" | "matrix" | "retro" | "burst" | "color" | "gitlog" | "guestbook";
export type AccentId = "violet" | "emerald" | "sunset" | "ocean";

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
    season: { novruz: "🔥 Novruz bayramınız mübarək!", winter: "❄️ Yeni iliniz mübarək!" },
    copy: { label: "E-poçtu kopyala", done: "E-poçt kopyalandı 📋" },
    keys: {
      title: "Qısayollar və ayarlar",
      close: "Bağla",
      items: [
        { keys: "⌘ K / Ctrl K", text: "Terminalı aç — help, hire-me, snake, typing, matrix..." },
        { keys: "?", text: "Bu pəncərə" },
        { keys: "Esc", text: "Pəncərəni / terminalı bağla" },
        { keys: "↑ ↑ ↓ ↓ ← → ← → B A", text: "Retro (8-bit) rejim" },
        { keys: "3D loqoya klik", text: "Hissəciklər partlayır" },
      ],
    },
    ach: {
      title: "Nailiyyətlər",
      progress: "{n}/{total} sirr tapıldı",
      unlocked: "🏆 Yeni sirr tapıldı: {name}",
      allDone: "🎉 Bütün sirləri tapdın! Sən əsl kəşfiyyatçısan.",
      locked: "Hələ tapılmayıb",
      names: { terminal: "Terminal ustası", snake: "İlan ovçusu", typing: "Sürətli barmaqlar", matrix: "Qırmızı həb", retro: "Retro oyunçu", burst: "Partlayış!", color: "Rəssam", gitlog: "Tarixçi", guestbook: "Qonaq" },
      hints: { terminal: "⌘K", snake: "snake", typing: "typing", matrix: "matrix", retro: "↑↑↓↓←→←→BA", burst: "3D loqo", color: "color", gitlog: "git log", guestbook: "sign" },
    },
    accent: { title: "Rəng", names: { violet: "Bənövşəyi", emerald: "Zümrüd", sunset: "Gün batımı", ocean: "Okean" } },
    music: { title: "Fon musiqisi", on: "Açıq", off: "Bağlı" },
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
    season: { novruz: "🔥 Happy Novruz!", winter: "❄️ Happy New Year!" },
    copy: { label: "Copy email", done: "Email copied 📋" },
    keys: {
      title: "Shortcuts & settings",
      close: "Close",
      items: [
        { keys: "⌘ K / Ctrl K", text: "Open the terminal — help, hire-me, snake, typing, matrix..." },
        { keys: "?", text: "This window" },
        { keys: "Esc", text: "Close window / terminal" },
        { keys: "↑ ↑ ↓ ↓ ← → ← → B A", text: "Retro (8-bit) mode" },
        { keys: "Click the 3D logo", text: "Particles burst" },
      ],
    },
    ach: {
      title: "Achievements",
      progress: "{n}/{total} secrets found",
      unlocked: "🏆 Secret found: {name}",
      allDone: "🎉 You found every secret! True explorer.",
      locked: "Not found yet",
      names: { terminal: "Terminal user", snake: "Snake charmer", typing: "Fast fingers", matrix: "Red pill", retro: "Retro gamer", burst: "Kaboom!", color: "Painter", gitlog: "Historian", guestbook: "Guest" },
      hints: { terminal: "⌘K", snake: "snake", typing: "typing", matrix: "matrix", retro: "↑↑↓↓←→←→BA", burst: "3D logo", color: "color", gitlog: "git log", guestbook: "sign" },
    },
    accent: { title: "Color", names: { violet: "Violet", emerald: "Emerald", sunset: "Sunset", ocean: "Ocean" } },
    music: { title: "Ambient music", on: "On", off: "Off" },
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
    season: { novruz: "🔥 С праздником Новруз!", winter: "❄️ С Новым годом!" },
    copy: { label: "Скопировать e-mail", done: "E-mail скопирован 📋" },
    keys: {
      title: "Горячие клавиши и настройки",
      close: "Закрыть",
      items: [
        { keys: "⌘ K / Ctrl K", text: "Открыть терминал — help, hire-me, snake, typing, matrix..." },
        { keys: "?", text: "Это окно" },
        { keys: "Esc", text: "Закрыть окно / терминал" },
        { keys: "↑ ↑ ↓ ↓ ← → ← → B A", text: "Ретро-режим (8-bit)" },
        { keys: "Клик по 3D-логотипу", text: "Частицы разлетаются" },
      ],
    },
    ach: {
      title: "Достижения",
      progress: "Найдено секретов: {n}/{total}",
      unlocked: "🏆 Найден секрет: {name}",
      allDone: "🎉 Вы нашли все секреты! Настоящий исследователь.",
      locked: "Ещё не найдено",
      names: { terminal: "Терминальщик", snake: "Заклинатель змей", typing: "Быстрые пальцы", matrix: "Красная таблетка", retro: "Ретро-геймер", burst: "Бабах!", color: "Художник", gitlog: "Историк", guestbook: "Гость" },
      hints: { terminal: "⌘K", snake: "snake", typing: "typing", matrix: "matrix", retro: "↑↑↓↓←→←→BA", burst: "3D-логотип", color: "color", gitlog: "git log", guestbook: "sign" },
    },
    accent: { title: "Цвет", names: { violet: "Фиолетовый", emerald: "Изумруд", sunset: "Закат", ocean: "Океан" } },
    music: { title: "Фоновая музыка", on: "Вкл", off: "Выкл" },
  },
};
