"use client";

import { motion } from "framer-motion";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

interface EnvelopeProps {
  isOpen: boolean;
}

export function Envelope({ isOpen }: EnvelopeProps) {
  const { tokens } = useWeddingTheme();

  return (
    <div
      className="relative w-64 h-44 md:w-96 md:h-64"
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
    >
      {/* Envelope Flap */}
      <motion.div
        initial={false}
        animate={{ rotateX: isOpen ? 180 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-1/2 z-30 origin-top"
        style={{
          backgroundColor: tokens.colors.primary,
          clipPath: "polygon(0 0, 50% 50%, 100% 0)",
          boxShadow: "inset 0 -5px 10px rgba(0,0,0,0.1)"
        }}
      />

      {/* Envelope Pocket (Front) */}
      <div
        className="absolute inset-0 z-20"
        style={{
          backgroundColor: tokens.colors.primary,
          clipPath: "polygon(0 0, 0 100%, 100% 100%, 100% 0, 100% 50%, 50% 100%, 0 50%)",
          boxShadow: "inset 0 10px 20px rgba(0,0,0,0.2)"
        }}
      />

      {/* Envelope Back (Base) */}
      <div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: tokens.colors.primary }}
      />
    </div>
  );
}
