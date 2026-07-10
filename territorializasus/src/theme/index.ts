// src/theme/index.ts
// =====================================================
// Design tokens extraídos do protótipo Lovable
// =====================================================
// Fonte: prototype/src/styles.css (oklch colors convertidas para hex)

export const colors = {
  // Primary
  primary: '#0766EE',
  primaryLight: '#DDF0FF',
  primarySoft: '#DDF0FF',
  primaryForeground: '#FFFFFF',

  // Backgrounds
  background: '#F8FAFD',
  card: '#FFFFFF',
  secondary: '#EDF2F8',

  // Text
  foreground: '#071123',
  mutedForeground: '#586474',

  // Semantic
  success: '#00AC5F',
  successLight: 'rgba(0, 172, 95, 0.15)',
  warning: '#EFA831',
  warningLight: 'rgba(239, 168, 49, 0.15)',
  warningBorder: 'rgba(239, 168, 49, 0.30)',
  destructive: '#EE343B',
  destructiveLight: 'rgba(238, 52, 59, 0.15)',

  // Borders
  border: '#E0E5EB',
  input: '#E0E5EB',

  // Gradient endpoints (for LinearGradient)
  gradientStart: '#2076FF',
  gradientEnd: '#384CDE',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  full: 9999,
};

export const typography = {
  fontFamily: {
    // System fonts (Sora / Plus Jakarta Sans não disponíveis nativamente em RN)
    // Usaremos System font por ora, com possibilidade de carregar via expo-font
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
    extrabold: 'System',
  },
  fontSize: {
    '3xs': 8,
    '2xs': 10,
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

export const shadows = {
  card: {
    shadowColor: '#0766EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#0766EE',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 8,
  },
};
