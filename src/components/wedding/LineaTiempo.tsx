"use client";

import { useEffect, useRef, useState } from "react";

/** La misma técnica de IntersectionObserver que FadeIn, pero anima
 *  un "crecimiento" vertical (scaleY 0 -> 1) en vez de una aparición,
 *  para simular que la línea del cronograma "se dibuja" una vez,
 *  reforzando la sensación de línea de tiempo sin sobrecargar. */
export function LineaTiempo() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute left-[3.2rem] top-2 bottom-2 w-px bg-accent/20 origin-top transition-transform duration-[1400ms] ease-out"
      style={{ transform: visible ? "scaleY(1)" : "scaleY(0)" }}
    />
  );
}
