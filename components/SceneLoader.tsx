"use client";

import { Component, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// WebGL yalnız brauzerdə işləyir — SSR söndürülür
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

// Ayrıca test konteksti yaratmırıq (bahalıdır və ikinci GL kontekst deməkdir):
// API ümumiyyətlə yoxdursa səhnəni göstərmirik, kontekst yaranmasa SceneBoundary tutur
const hasWebGL = () => typeof window.WebGLRenderingContext !== "undefined";

// 3D səhnə çöksə, saytın qalanı işləməyə davam edir
class SceneBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function SceneLoader() {
  const [supported, setSupported] = useState(false);
  // Səhnə ilk görünüşdən sonra, brauzer boş olanda başlayır — WebGL kontekstinin yaradılması
  // hero mətninin animasiyası ilə eyni vaxta düşməsin
  useEffect(() => {
    if (!hasWebGL()) return;
    const start = () => setSupported(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(start, { timeout: 1200 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, []);

  if (!supported) return null;
  return (
    <SceneBoundary>
      <Scene />
    </SceneBoundary>
  );
}
