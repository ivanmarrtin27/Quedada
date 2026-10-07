export const colors = {
  bg: '#0B1020',
  bgSoft: '#151C32',
  card: '#1A2340',
  cardElevated: '#243056',
  border: '#3A4668',
  borderSoft: '#2A3554',
  text: '#FFFFFF',
  textMuted: '#A8B4D0',
  textDim: '#6E7C9C',
  accent: '#FF4D6D',
  accentAlt: '#00D1FF',
  white: '#FFFFFF',
  black: '#000000',
  success: '#00E8A0',
  warning: '#FFB020',
  violet: '#A78BFA',
  orange: '#FF7A3D',
  pink: '#FF6BCB',
  lime: '#B8F000',
  glow: 'rgba(0, 209, 255, 0.18)',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
};

/** Soft tint helpers for cards / borders */
export function withAlpha(hex: string, alphaHex: string) {
  return `${hex}${alphaHex}`;
}
