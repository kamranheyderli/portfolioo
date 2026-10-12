// <head>-də ilk rəngləmədən əvvəl işləyən skriptlər.
// "use client" faylında olmamalıdır, yoxsa server onları mətn kimi göstərə bilmir.
export const THEME_KEY = "theme";
export const INTRO_KEY = "intro-seen";

// İlk rəngləmədən əvvəl işləyir ki, səhifə yanlış temada "yanıb-sönməsin"
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;

// Eyni sessiyada təkrar açılanda preloader göstərilmir (ilk rəngləmədən əvvəl işləyir)
export const introInitScript = `(function(){try{if(sessionStorage.getItem("${INTRO_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-skip")}catch(e){}})()`;
