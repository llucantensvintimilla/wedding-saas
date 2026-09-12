"use client";

import React, { createContext, useContext } from "react";
import { LuxuryPreset, AnimationLevel, WEDDING_THEMES, ANIMATION_CONFIGS, ThemeTokens } from "@/lib/wedding-themes";

interface WeddingThemeContextType {
  preset: LuxuryPreset;
  tokens: ThemeTokens;
  animation: typeof ANIMATION_CONFIGS['subtle'];
}

const WeddingThemeContext = createContext<WeddingThemeContextType | undefined>(undefined);

export function WeddingThemeProvider({
  children,
  preset = "gold_minimal",
  animation = "subtle",
}: {
  children: React.ReactNode;
  preset?: LuxuryPreset;
  animation?: AnimationLevel;
}) {
  const tokens = WEDDING_THEMES[preset];
  const animationConfig = ANIMATION_CONFIGS[animation];

  return (
    <WeddingThemeContext.Provider value={{ preset, tokens, animation: animationConfig }}>
      <div
        style={{
          backgroundColor: tokens.colors.background,
          color: tokens.colors.text
        }}
        className="min-h-full transition-colors duration-500"
      >
        {children}
      </div>
    </WeddingThemeContext.Provider>
  );
}

export function useWeddingTheme() {
  const context = useContext(WeddingThemeContext);
  if (context === undefined) {
    // Fallback for components used outside of a wedding experience (e.g. Landing Page)
    return {
      preset: "gold_minimal",
      tokens: WEDDING_THEMES["gold_minimal"],
      animation: ANIMATION_CONFIGS["subtle"],
    };
  }
  return context;
}
