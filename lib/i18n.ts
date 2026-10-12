export const languages = [
  { code: "az", label: "AZ" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
] as const;

export type Lang = (typeof languages)[number]["code"];

// Başlıqdakı { em: true } hissələr rəngli göstərilir
type Part = { t: string; em?: boolean };

export type Dict = {
  nav: { about: string; experience: string; skills: string; contact: string };
  hero: { available: string; tagline: string; scroll: string; ctaPrimary: string; ctaSecondary: string; cv: string };
  about: { label: string; title: Part[]; text: string; stats: { value: string; label: string }[] };
  experience: {
    label: string;
    title: string;
    eduLabel: string;
    jobs: { period: string; points: string[] }[];
    education: { title: string; detail: string; period: string }[];
  };
  skills: {
    label: string;
    title: string;
    groups: { frontend: string; ui: string; practices: string; languages: string };
    languages: string[];
  };
  contact: {
    label: string;
    line1: string;
    highlight: string;
    line2: string;
    location: string;
    or: string;
    form: {
      name: string; email: string; message: string;
      namePh: string; emailPh: string; messagePh: string;
      send: string; sending: string; success: string; error: string;
      thanksTitle: string; thanksText: string; again: string;
    };
  };
};

export const dict: Record<Lang, Dict> = {
  az: {
    nav: { about: "Haqqımda", experience: "Təcrübə", skills: "Bacarıqlar", contact: "Əlaqə" },
    hero: {
      available: "Yeni layihələrə açığam",
      tagline: "Sürətli, miqyaslana bilən və istifadəçi yönümlü veb interfeyslər yaradıram.",
      scroll: "Scroll",
      ctaPrimary: "Əlaqə saxla",
      ctaSecondary: "Təcrübəmə bax",
      cv: "CV yüklə",
    },
    about: {
      label: "01 — Haqqımda",
      title: [{ t: "Dizaynı " }, { t: "kodla", em: true }, { t: ", kodu " }, { t: "hisslə", em: true }, { t: " birləşdirirəm." }],
      text: "Müasir veb texnologiyaları və Agile əməkdaşlıq üzrə təcrübəli Front-end Developerəm. Təmiz kod, intuitiv UI və etibarlı məhsul funksiyaları təqdim edirəm. React, Next.js və TypeScript ilə ERP sistemlərindən micro-frontend arxitekturasına qədər müxtəlif layihələrdə çalışmışam.",
      stats: [
        { value: "3+", label: "il təcrübə" },
        { value: "3", label: "şirkət" },
        { value: "2", label: "akademiya" },
      ],
    },
    experience: {
      label: "02 — Təcrübə",
      title: "İş təcrübəsi",
      eduLabel: "Təhsil və sertifikatlar",
      jobs: [
        {
          period: "Fev 2025 — İndi",
          points: [
            "Miqyaslanma üçün micro-frontend modulları qurdum.",
            "Dizayn komandası ilə birgə istifadəçi dostu UI komponentləri hazırladım.",
            "Code review apardım və front-end performansını optimallaşdırdım.",
          ],
        },
        {
          period: "Avq 2023 — Fev 2025",
          points: [
            "UX və biznes tələblərini səliqəli kod həllərinə çevirdim.",
            "ERP sistemi üçün React ilə funksionallıqlar hazırladım.",
            "Cədvəllərdə front-end hesablamaları və asılılıqları qurdum.",
            "Agile prinsipləri ilə code review və debugging apardım.",
          ],
        },
        {
          period: "2023",
          points: [
            "HTML, CSS və JavaScript kodunu refaktor edərək performansı artırdım.",
            "Müştəri məmnuniyyətini artıran xüsusi animasiya və keçidlər yaratdım.",
            "React ilə təkrar istifadə olunan komponentlər hazırladım.",
          ],
        },
      ],
      education: [
        { title: "Garage Academy", detail: "Front-End Development", period: "07/2023 — 11/2023" },
        { title: "Ingress Academy", detail: "Front-End Development", period: "11/2022 — 05/2023" },
        { title: "Sumqayıt Dövlət Universiteti", detail: "Bakalavr, Mühasibat uçotu", period: "2020" },
      ],
    },
    skills: {
      label: "04 — Alətlər",
      title: "Bacarıqlar",
      groups: { frontend: "Frontend", ui: "UI Frameworks", practices: "Təcrübələr", languages: "Dillər" },
      languages: ["Azərbaycan — ana dili", "Türk — Upper Intermediate", "İngilis — Intermediate"],
    },
    contact: {
      label: "05 — Əlaqə",
      line1: "Gəlin birlikdə",
      highlight: "nəsə maraqlı",
      line2: " yaradaq.",
      location: "Bakı, Azərbaycan",
      or: "və ya birbaşa yazın",
      form: {
        name: "Adınız", email: "E-poçt", message: "Mesaj",
        namePh: "Adınız və soyadınız", emailPh: "siz@example.com", messagePh: "Layihə və ya təklif haqqında yazın...",
        send: "Göndər", sending: "Göndərilir...", success: "Mesajınız göndərildi. Tezliklə cavab verəcəm!",
        error: "Mesaj göndərilmədi. Birbaşa yazın:",
        thanksTitle: "Təşəkkür edirəm, {name}!",
        thanksText: "Mesajınız mənə çatdı. Adətən 24 saat ərzində cavab verirəm.",
        again: "Yeni mesaj yaz",
      },
    },
  },

  en: {
    nav: { about: "About", experience: "Experience", skills: "Skills", contact: "Contact" },
    hero: {
      available: "Open to new projects",
      tagline: "I build fast, scalable and user-centered web interfaces.",
      scroll: "Scroll",
      ctaPrimary: "Get in touch",
      ctaSecondary: "View experience",
      cv: "Download CV",
    },
    about: {
      label: "01 — About",
      title: [{ t: "Blending " }, { t: "design", em: true }, { t: " with " }, { t: "code", em: true }, { t: "." }],
      text: "Front-End Developer skilled in modern web technologies and Agile collaboration, delivering clean code, intuitive UI and reliable product features. I've worked with React, Next.js and TypeScript on everything from ERP systems to micro-frontend architecture.",
      stats: [
        { value: "3+", label: "years experience" },
        { value: "3", label: "companies" },
        { value: "2", label: "academies" },
      ],
    },
    experience: {
      label: "02 — Experience",
      title: "Work experience",
      eduLabel: "Education & certifications",
      jobs: [
        {
          period: "Feb 2025 — Present",
          points: [
            "Implemented micro-frontend modules for scalability.",
            "Delivered user-friendly UI components in collaboration with design teams.",
            "Performed code reviews and optimized front-end performance.",
          ],
        },
        {
          period: "Aug 2023 — Feb 2025",
          points: [
            "Translated UX and business requirements into elegant code solutions.",
            "Built features for an ERP system with React.",
            "Implemented front-end calculations and table dependencies.",
            "Conducted code reviews and debugging following Agile principles.",
          ],
        },
        {
          period: "2023",
          points: [
            "Refactored HTML, CSS and JavaScript to improve performance and maintainability.",
            "Created custom animations and transitions that increased customer satisfaction.",
            "Developed reusable React components to streamline development.",
          ],
        },
      ],
      education: [
        { title: "Garage Academy", detail: "Front-End Development", period: "07/2023 — 11/2023" },
        { title: "Ingress Academy", detail: "Front-End Development", period: "11/2022 — 05/2023" },
        { title: "Sumgait State University", detail: "B.Sc. in Accounting", period: "2020" },
      ],
    },
    skills: {
      label: "04 — Tools",
      title: "Skills",
      groups: { frontend: "Frontend", ui: "UI Frameworks", practices: "Practices", languages: "Languages" },
      languages: ["Azerbaijani — Native", "Turkish — Upper Intermediate", "English — Intermediate"],
    },
    contact: {
      label: "05 — Contact",
      line1: "Let's build",
      highlight: "something great",
      line2: " together.",
      location: "Baku, Azerbaijan",
      or: "or write directly",
      form: {
        name: "Name", email: "Email", message: "Message",
        namePh: "Your full name", emailPh: "you@example.com", messagePh: "Tell me about your project or offer...",
        send: "Send", sending: "Sending...", success: "Your message has been sent. I'll get back to you soon!",
        error: "Couldn't send the message. Write directly:",
        thanksTitle: "Thank you, {name}!",
        thanksText: "Your message landed in my inbox. I usually reply within 24 hours.",
        again: "Send another message",
      },
    },
  },

  ru: {
    nav: { about: "Обо мне", experience: "Опыт", skills: "Навыки", contact: "Контакты" },
    hero: {
      available: "Открыт для новых проектов",
      tagline: "Создаю быстрые, масштабируемые и ориентированные на пользователя веб-интерфейсы.",
      scroll: "Листайте",
      ctaPrimary: "Связаться",
      ctaSecondary: "Мой опыт",
      cv: "Скачать CV",
    },
    about: {
      label: "01 — Обо мне",
      title: [{ t: "Объединяю " }, { t: "дизайн", em: true }, { t: " и " }, { t: "код", em: true }, { t: "." }],
      text: "Front-end разработчик с опытом в современных веб-технологиях и Agile-командах. Пишу чистый код, создаю интуитивные интерфейсы и надёжные продуктовые функции. Работал с React, Next.js и TypeScript — от ERP-систем до micro-frontend архитектуры.",
      stats: [
        { value: "3+", label: "года опыта" },
        { value: "3", label: "компании" },
        { value: "2", label: "академии" },
      ],
    },
    experience: {
      label: "02 — Опыт",
      title: "Опыт работы",
      eduLabel: "Образование и сертификаты",
      jobs: [
        {
          period: "Фев 2025 — н.в.",
          points: [
            "Внедрил micro-frontend модули для масштабируемости.",
            "Разрабатывал удобные UI-компоненты совместно с командой дизайна.",
            "Проводил code review и оптимизировал производительность фронтенда.",
          ],
        },
        {
          period: "Авг 2023 — Фев 2025",
          points: [
            "Превращал UX и бизнес-требования в аккуратные решения в коде.",
            "Разрабатывал функциональность ERP-системы на React.",
            "Реализовал вычисления на фронтенде и зависимости в таблицах.",
            "Проводил code review и отладку по принципам Agile.",
          ],
        },
        {
          period: "2023",
          points: [
            "Рефакторил HTML, CSS и JavaScript, повысив производительность и поддерживаемость.",
            "Создавал анимации и переходы, повысившие удовлетворённость клиентов.",
            "Разрабатывал переиспользуемые компоненты на React.",
          ],
        },
      ],
      education: [
        { title: "Garage Academy", detail: "Front-End Development", period: "07/2023 — 11/2023" },
        { title: "Ingress Academy", detail: "Front-End Development", period: "11/2022 — 05/2023" },
        { title: "Сумгайытский государственный университет", detail: "Бакалавр, бухгалтерский учёт", period: "2020" },
      ],
    },
    skills: {
      label: "04 — Инструменты",
      title: "Навыки",
      groups: { frontend: "Frontend", ui: "UI-фреймворки", practices: "Практики", languages: "Языки" },
      languages: ["Азербайджанский — родной", "Турецкий — Upper Intermediate", "Английский — Intermediate"],
    },
    contact: {
      label: "05 — Контакты",
      line1: "Давайте создадим",
      highlight: "что-то крутое",
      line2: " вместе.",
      location: "Баку, Азербайджан",
      or: "или напишите напрямую",
      form: {
        name: "Имя", email: "Email", message: "Сообщение",
        namePh: "Ваше имя и фамилия", emailPh: "you@example.com", messagePh: "Расскажите о проекте или предложении...",
        send: "Отправить", sending: "Отправка...", success: "Сообщение отправлено. Скоро отвечу!",
        error: "Не удалось отправить. Напишите напрямую:",
        thanksTitle: "Спасибо, {name}!",
        thanksText: "Ваше сообщение у меня. Обычно отвечаю в течение 24 часов.",
        again: "Написать ещё",
      },
    },
  },
};
