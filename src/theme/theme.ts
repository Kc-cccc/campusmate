import type { TextStyle, ViewStyle } from 'react-native';
import type { TextScale, ThemeMode } from '../types/models';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 30,
  xxxl: 38
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  pill: 999
} as const;

export const shadows = {
  card: {
    shadowOpacity: 0.055,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2
  } satisfies ViewStyle,
  soft: {
    shadowOpacity: 0.035,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 1
  } satisfies ViewStyle
};

/**
 * Visual direction: Midnight Ledger.
 * A cool porcelain, navy and copper system built to feel like a focused
 * university productivity tool, not a nature-themed app or generic AI template.
 */
type Palette = {
  mode: ThemeMode;
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryDark: string;
  primarySoft: string;
  success: string;
  warning: string;
  danger: string;
  chip: string;
  shadow: string;
};

const lightPalette: Palette = {
  mode: 'light',
  background: '#F3F6F8',
  surface: '#FFFFFF',
  surfaceMuted: '#E8EEF3',
  border: '#D5DEE7',
  text: '#17202E',
  textMuted: '#687586',
  primary: '#26375F',
  primaryDark: '#101A33',
  primarySoft: '#E8ECF6',
  success: '#2F5F8F',
  warning: '#B57922',
  danger: '#B45C4B',
  chip: '#EDF2F6',
  shadow: '#111827'
};

const darkPalette: Palette = {
  mode: 'dark',
  background: '#0A0F1A',
  surface: '#111827',
  surfaceMuted: '#1A2435',
  border: '#2B3648',
  text: '#F4F7FB',
  textMuted: '#A7B2C1',
  primary: '#B8C7F2',
  primaryDark: '#E8EEFF',
  primarySoft: '#202A44',
  success: '#86B6F0',
  warning: '#F0BC6B',
  danger: '#E28B7E',
  chip: '#202939',
  shadow: '#000000'
};

export type AppTheme = Palette & {
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  typography: ReturnType<typeof createTypography>;
};
export const textScaleValues: Record<TextScale, number> = {
  small: 0.94,
  medium: 1,
  large: 1.12
};

function createTypography(scale: TextScale) {
  const ratio = textScaleValues[scale];
  const font = (size: number, lineHeight: number, weight: TextStyle['fontWeight'] = '500'): TextStyle => ({
    fontSize: Math.round(size * ratio),
    lineHeight: Math.round(lineHeight * ratio),
    fontWeight: weight,
    letterSpacing: -0.08
  });

  return {
    hero: font(34, 40, '800'),
    title: font(26, 32, '800'),
    subtitle: font(20, 26, '700'),
    body: font(16, 23, '500'),
    bodyStrong: font(16, 23, '700'),
    caption: font(13, 18, '600'),
    label: font(12, 16, '800')
  };
}

export function createTheme(mode: ThemeMode, textScale: TextScale): AppTheme {
  const palette = mode === 'dark' ? darkPalette : lightPalette;
  return {
    ...palette,
    spacing,
    radius,
    shadows,
    typography: createTypography(textScale)
  };
}
