// <head>-də ilk rəngləmədən əvvəl işləyən skriptlər.
// "use client" faylında olmamalıdır, yoxsa server onları mətn kimi göstərə bilmir.
export const THEME_KEY = "theme";
export const INTRO_KEY = "intro-seen";

// İlk rəngləmədən əvvəl işləyir ki, səhifə yanlış temada "yanıb-sönməsin"
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;

// Preloader yalnız ana səhifədə və sessiyada bir dəfə göstərilir (ilk rəngləmədən əvvəl işləyir)
export const introInitScript = `(function(){try{if(location.pathname!=="/"||sessionStorage.getItem("${INTRO_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-skip")}catch(e){}})()`;

// Seçilmiş rəng palitrası ilk rəngləmədən əvvəl tətbiq olunur
export const accentInitScript = `(function(){try{var a=localStorage.getItem("accent");if(a&&a!=="violet"&&/^(emerald|sunset|ocean)$/.test(a))document.documentElement.dataset.accent=a}catch(e){}})()`;
