export type LuxuryPreset = 'gold_minimal' | 'floral_classic' | 'modern_dark';
export type AnimationLevel = 'subtle' | 'dynamic' | 'high';

export interface ThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography: {
    heading: string; // CSS class or font family
    body: string;
  };
  borderStyle: 'thin' | 'double' | 'none';
  separator: 'line' | 'floral' | 'none';
}

export const WEDDING_THEMES: Record<LuxuryPreset, ThemeTokens> = {
  gold_minimal: {
    colors: {
      primary: '#b08d57', // Gold
      secondary: '#fdfbf7',
      accent: '#8a6d3b',
      background: '#faf7f2',
      text: '#1a1a1a',
      muted: '#666666',
    },
    typography: {
      heading: 'font-serif italic',
      body: 'font-body',
    },
    borderStyle: 'thin',
    separator: 'line',
  },
  floral_classic: {
    colors: {
      primary: '#d4a373', // Soft tan/gold
      secondary: '#fefae0',
      accent: '#bc6c25',
      background: '#fffdfa',
      text: '#283618', // Dark olive/green
      muted: '#606c38',
    },
    typography: {
      heading: 'font-serif',
      body: 'font-body',
    },
    borderStyle: 'double',
    separator: 'floral',
  },
  modern_dark: {
    colors: {
      primary: '#e5e7eb', // Silver/White
      secondary: '#1f2937',
      accent: '#9ca3af',
      background: '#111827',
      text: '#f9fafb',
      muted: '#9ca3af',
    },
    typography: {
      heading: 'font-sans uppercase tracking-widest',
      body: 'font-body',
    },
    borderStyle: 'none',
    separator: 'none',
  },
};

export const ANIMATION_CONFIGS: Record<AnimationLevel, {
  duration: number;
  stiffness: number;
  damping: number;
  delay: number;
}> = {
  subtle: {
    duration: 0.6,
    stiffness: 100,
    damping: 20,
    delay: 0.1,
  },
  dynamic: {
    duration: 0.8,
    stiffness: 150,
    damping: 15,
    delay: 0.2,
  },
  high: {
    duration: 1.0,
    stiffness: 200,
    damping: 12,
    delay: 0.3,
  },
};
