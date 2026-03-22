// src/app/components/BackToTop.tsx
"use client";

import React, { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Voltar ao topo"
      className="fixed right-6 bottom-8 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:scale-105 transition"
    >
      ↑
    </button>
  );
}
