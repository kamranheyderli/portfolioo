import type { Lang } from "./i18n";

// Lab, 404, blog və "uses" mətnləri (əsas mətnlər lib/i18n.ts-dədir)
export type Extra = {
  nav: { lab: string; blog: string };
  lab: {
    label: string;
    title: string;
    intro: string;
    tabs: { erp: string; mfe: string };
    erp: {
      hint: string; search: string; add: string; product: string; qty: string; price: string;
      discount: string; subtotal: string; vat: string; total: string; totals: string; empty: string;
      remove: string; newItem: string;
    };
    mfe: {
      hint: string; shell: string; catalog: string; cart: string; notifications: string; add: string;
      checkout: string; emptyCart: string; crash: string; crashed: string; reload: string; redeploy: string;
      log: string; added: string; order: string; noNotif: string; items: string;
    };
  };
  uses: { title: string; items: { name: string; note: string }[] };
  notFound: { title: string; text: string; back: string };
  blog: { label: string; title: string; intro: string; read: string; back: string; min: string; onlyAz: string };
};

export const extra: Record<Lang, Extra> = {
  az: {
    nav: { lab: "Lab", blog: "Blog" },
    lab: {
      label: "03 — Lab",
      title: "Canlı demolar",
      intro: "Real layihələrim private olduğu üçün gündəlik işimə bənzəyən kiçik, işlək demolar hazırladım. Sınayın!",
      tabs: { erp: "ERP cədvəli", mfe: "Micro-frontend" },
      erp: {
        hint: "Rəqəmləri dəyişin — cəmlər, ƏDV və yekun dərhal yenidən hesablanır. Sütun başlığına basaraq sıralayın.",
        search: "Məhsul axtar...", add: "Sətir əlavə et", product: "Məhsul", qty: "Say", price: "Qiymət",
        discount: "Endirim %", subtotal: "Ara cəm", vat: "ƏDV 18%", total: "Yekun", totals: "Cəmi",
        empty: "Heç nə tapılmadı", remove: "Sil", newItem: "Yeni məhsul",
      },
      mfe: {
        hint: "Hər modul müstəqildir: öz versiyası var, event bus ilə danışır. Birini \"çökdürün\" — qalanları işləməyə davam edir.",
        shell: "Shell tətbiq", catalog: "Kataloq", cart: "Səbət", notifications: "Bildirişlər", add: "Səbətə at",
        checkout: "Sifariş ver", emptyCart: "Səbət boşdur", crash: "Çökdür", crashed: "Bu modul çökdü — amma qalan tətbiq işləyir.",
        reload: "Yenidən yüklə", redeploy: "Deploy et", log: "Event bus", added: "səbətə əlavə olundu",
        order: "Sifariş qəbul olundu", noNotif: "Hələ bildiriş yoxdur", items: "məhsul",
      },
    },
    uses: {
      title: "Gündəlik alətlər",
      items: [
        { name: "VS Code", note: "Əsas redaktor" },
        { name: "Figma", note: "Dizayndan koda" },
        { name: "Git · GitHub · GitLab", note: "Versiya nəzarəti" },
        { name: "Chrome DevTools", note: "Debug və performans" },
        { name: "MacBook", note: "Gündəlik iş maşını" },
      ],
    },
    notFound: { title: "Səhifə tapılmadı", text: "Görünür, bu səhifə hissəciklərə çevrilib dağılıb.", back: "Ana səhifəyə qayıt" },
    blog: {
      label: "Blog", title: "Qeydlər və yazılar", intro: "Front-end, React və işlədiyim layihələr haqqında qısa yazılar.",
      read: "Oxu", back: "Bütün yazılar", min: "dəq oxu", onlyAz: "Yazılar Azərbaycan dilindədir.",
    },
  },

  en: {
    nav: { lab: "Lab", blog: "Blog" },
    lab: {
      label: "03 — Lab",
      title: "Live demos",
      intro: "My real projects are private, so I built small working demos similar to my day-to-day work. Try them!",
      tabs: { erp: "ERP table", mfe: "Micro-frontend" },
      erp: {
        hint: "Change the numbers — subtotals, VAT and totals recalculate instantly. Click a column header to sort.",
        search: "Search products...", add: "Add row", product: "Product", qty: "Qty", price: "Price",
        discount: "Discount %", subtotal: "Subtotal", vat: "VAT 18%", total: "Total", totals: "Totals",
        empty: "Nothing found", remove: "Remove", newItem: "New product",
      },
      mfe: {
        hint: "Each module is independent: its own version, talking over an event bus. \"Crash\" one — the rest keeps working.",
        shell: "Shell app", catalog: "Catalog", cart: "Cart", notifications: "Notifications", add: "Add to cart",
        checkout: "Checkout", emptyCart: "Cart is empty", crash: "Crash", crashed: "This module crashed — but the rest of the app still works.",
        reload: "Reload", redeploy: "Deploy", log: "Event bus", added: "added to cart",
        order: "Order placed", noNotif: "No notifications yet", items: "items",
      },
    },
    uses: {
      title: "Daily tools",
      items: [
        { name: "VS Code", note: "Main editor" },
        { name: "Figma", note: "Design to code" },
        { name: "Git · GitHub · GitLab", note: "Version control" },
        { name: "Chrome DevTools", note: "Debugging & performance" },
        { name: "MacBook", note: "Daily driver" },
      ],
    },
    notFound: { title: "Page not found", text: "Looks like this page turned into particles and drifted away.", back: "Back to home" },
    blog: {
      label: "Blog", title: "Notes & articles", intro: "Short posts about front-end, React and the things I build.",
      read: "Read", back: "All posts", min: "min read", onlyAz: "Posts are written in Azerbaijani.",
    },
  },

  ru: {
    nav: { lab: "Лаб", blog: "Блог" },
    lab: {
      label: "03 — Лаб",
      title: "Живые демо",
      intro: "Мои реальные проекты закрыты, поэтому я сделал небольшие рабочие демо, похожие на мою повседневную работу. Попробуйте!",
      tabs: { erp: "ERP-таблица", mfe: "Micro-frontend" },
      erp: {
        hint: "Меняйте числа — суммы, НДС и итог пересчитываются мгновенно. Нажмите на заголовок столбца для сортировки.",
        search: "Поиск товара...", add: "Добавить строку", product: "Товар", qty: "Кол-во", price: "Цена",
        discount: "Скидка %", subtotal: "Сумма", vat: "НДС 18%", total: "Итого", totals: "Всего",
        empty: "Ничего не найдено", remove: "Удалить", newItem: "Новый товар",
      },
      mfe: {
        hint: "Каждый модуль независим: своя версия, общение через event bus. «Сломайте» один — остальные продолжат работать.",
        shell: "Shell-приложение", catalog: "Каталог", cart: "Корзина", notifications: "Уведомления", add: "В корзину",
        checkout: "Оформить", emptyCart: "Корзина пуста", crash: "Сломать", crashed: "Модуль упал — но остальное приложение работает.",
        reload: "Перезагрузить", redeploy: "Задеплоить", log: "Event bus", added: "добавлен в корзину",
        order: "Заказ оформлен", noNotif: "Пока нет уведомлений", items: "товаров",
      },
    },
    uses: {
      title: "Инструменты",
      items: [
        { name: "VS Code", note: "Основной редактор" },
        { name: "Figma", note: "Из дизайна в код" },
        { name: "Git · GitHub · GitLab", note: "Контроль версий" },
        { name: "Chrome DevTools", note: "Отладка и производительность" },
        { name: "MacBook", note: "Рабочая машина" },
      ],
    },
    notFound: { title: "Страница не найдена", text: "Похоже, эта страница рассыпалась на частицы.", back: "На главную" },
    blog: {
      label: "Блог", title: "Заметки и статьи", intro: "Короткие заметки о фронтенде, React и моих проектах.",
      read: "Читать", back: "Все статьи", min: "мин чтения", onlyAz: "Статьи написаны на азербайджанском.",
    },
  },
};
