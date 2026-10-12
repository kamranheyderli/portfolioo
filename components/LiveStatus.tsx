"use client";

import { useEffect, useState } from "react";
import { useLang, useM } from "./LangProvider";

type Mode = "online" | "evening" | "sleeping" | "weekend";

// Ziyarətçinin saat qurşağından asılı olmayaraq Bakı vaxtı
function bakuNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Baku", hour: "2-digit", minute: "2-digit", weekday: "short", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const hour = Number(get("hour"));
  const weekday = get("weekday");
  const mode: Mode =
    weekday === "Sat" || weekday === "Sun" ? "weekend"
    : hour >= 9 && hour < 19 ? "online"
    : hour >= 19 && hour < 23 ? "evening"
    : "sleeping";
  return { time: `${get("hour")}:${get("minute")}`, mode };
}

export default function LiveStatus() {
  const m = useM().status;
  const { lang } = useLang();
  const [now, setNow] = useState<ReturnType<typeof bakuNow> | null>(null);

  useEffect(() => {
    setNow(bakuNow());
    const id = setInterval(() => setNow(bakuNow()), 20_000);
    return () => clearInterval(id);
  }, []);

  // Server render zamanı saat göstərilmir — hidratasiya uyğunsuzluğu olmasın
  if (!now) return <div className="live-status glass" aria-hidden style={{ visibility: "hidden" }}>00:00</div>;

  return (
    <div className={`live-status glass ${now.mode}`} lang={lang}>
      <span className="live-dot" aria-hidden />
      <span className="live-time">
        {m.inBaku} <b>{now.time}</b>
      </span>
      <span className="live-sep" aria-hidden>·</span>
      <span>{m[now.mode]}</span>
    </div>
  );
}
