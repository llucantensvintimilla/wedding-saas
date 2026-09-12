"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Envelope } from "./Envelope";
import { InvitationCard } from "./InvitationCard";

interface InvitationExperienceProps {
  children: React.ReactNode;
  nombreNovia: string;
  nombreNovio: string;
}

export function InvitationExperience({ children, nombreNovia, nombreNovio }: InvitationExperienceProps) {
  const [hasSeen, setHasSeen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("ourwedding_invitation_seen");
    if (seen === "true") {
      setHasSeen(true);
    } else {
      // Start opening sequence after a short delay
      const timer = setTimeout(() => setIsOpening(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (isOpening) {
      const timer = setTimeout(() => setIsRevealed(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpening]);

  const handleEnter = () => {
    setIsFadingOut(true);
    localStorage.setItem("ourwedding_invitation_seen", "true");
    setTimeout(() => setHasSeen(true), 800);
  };

  if (hasSeen) return <>{children}</>;

  return (
    <AnimatePresence>
      {!hasSeen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#faf7f2] overflow-hidden"
        >
          <div className="relative flex items-center justify-center">
            <Envelope isOpen={isOpening} />
            <InvitationCard
              nombreNovia={nombreNovia}
              nombreNovio={nombreNovio}
              isOpen={isRevealed}
              onEnter={handleEnter}
            />
          </div>

          {/* Subtle Skip button */}
          <button
            onClick={handleEnter}
            className="absolute bottom-12 right-12 text-black/30 text-xs uppercase tracking-widest hover:text-black transition-colors"
          >
            Skip Animation
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
