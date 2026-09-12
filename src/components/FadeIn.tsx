"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

/**
 * Envuelve cualquier contenido y lo hace aparecer con un fundido
 * suave (fade-in) y un ligero desplazamiento hacia arriba, justo
 * cuando entra en el viewport al hacer scroll.
 *
 * Ahora utiliza el sistema de animación global definido en el preset de la boda.
 */
export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { animation } = useWeddingTheme();

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
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: animation.duration,
        stiffness: animation.stiffness,
        damping: animation.damping,
        delay: animation.delay + (delay / 1000),
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
