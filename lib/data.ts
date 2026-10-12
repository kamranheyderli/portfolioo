// Dildən asılı olmayan məlumatlar. Mətnlər lib/i18n.ts faylındadır.
export const profile = {
  name: "Kamran Heyderli",
  role: "Front-end Engineer",
  email: "kamranheyderli33@gmail.com",
  phone: "+994 51 662 15 99",
  photo: "/kamran.jpg",
  socials: [
    { label: "GitHub", href: "https://github.com/kamranheyderli" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/kamran-heyderli-13a1a3213/" },
    { label: "Gmail", href: "mailto:kamranheyderli33@gmail.com" },
  ],
};

// Sıra lib/i18n.ts-dəki jobs siyahısı ilə eynidir
export const companies = [
  { company: "IkTex", role: "Front-end Developer", color: "#7c5cff" },
  { company: "Cheveek", role: "Front-end Developer", color: "#00d4ff" },
  { company: "Vabiss", role: "Front-end Developer", color: "#ff4d8d" },
];

export const skillGroups = [
  { key: "frontend", items: ["HTML5", "CSS3 / SASS", "JavaScript (ES6+)", "React.js", "Next.js", "Redux", "TypeScript"] },
  { key: "ui", items: ["Material UI", "Ant Design", "Bootstrap 5", "Tailwind CSS"] },
  { key: "practices", items: ["Responsive Design", "Agile", "Code Review", "Debugging", "Micro-Frontend"] },
] as const;

export const skills = [
  "React", "Next.js", "TypeScript", "JavaScript", "Redux", "Tailwind CSS",
  "Material UI", "Ant Design", "SASS", "Micro-Frontend", "Three.js", "Figma",
];
