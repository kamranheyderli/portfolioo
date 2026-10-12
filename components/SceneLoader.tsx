"use client";

import { Component, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// WebGL yalnız brauzerdə işləyir — SSR söndürülür
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

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
  useEffect(() => setSupported(hasWebGL()), []);

  if (!supported) return null;
  return (
    <SceneBoundary>
      <Scene />
    </SceneBoundary>
  );
}
