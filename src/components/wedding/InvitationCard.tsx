"use client";

import { motion } from "framer-motion";
import { useWeddingTheme } from "@/components/wedding/WeddingThemeProvider";

interface InvitationCardProps {
  nombreNovia: string;
  nombreNovio: string;
  isOpen: boolean;
  onEnter: () => void;
}

export function InvitationCard({ nombreNovia, nombreNovio, isOpen, onEnter }: InvitationCardProps) {
  const { tokens } = useWeddingTheme();

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: isOpen ? -150 : 0 }}
      transition={{
        duration: 0.8,
        delay: 0.6,
        ease: [0.34, 1.56, 0.64, 1]
      }}
      className="absolute inset-x-8 top-4 z-40 p-8 shadow-2xl rounded-sm text-center"
      style={{
        backgroundColor: tokens.colors.background,
        borderColor: tokens.colors.primary,
        borderWidth: "1px",
        minHeight: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div className="space-y-6">
        <p className={`text-xs uppercase tracking-[0.3em] opacity-60 ${tokens.typography.body}`}>
          You are invited to celebrate
        </p>

        <h2 className={`text-3xl md:text-5xl leading-tight ${tokens.typography.heading}`}>
          {nombreNovia} <span className="block text-xl opacity-60 font-normal italic my-2">&amp;</span> {nombreNovio}
        </h2>

        <div className="h-px w-12 bg-primary/30 mx-auto my-6" />

        <button
          onClick={onEnter}
          className="px-8 py-3 rounded-full bg-foreground text-background text-xs font-medium hover:opacity-90 transition-all active:scale-95 shadow-lg"
        >
          Enter Experience
        </button>
      </div>
    </motion.div>
  );
}
