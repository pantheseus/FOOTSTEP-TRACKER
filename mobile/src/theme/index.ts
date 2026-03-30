import { TextStyle, useColorScheme } from 'react-native';

const LightColors = {
  primary: '#5B5FEF',
  secondary: '#a855f7',
  background: '#F2F2F7', // iOS Light Gray
  card: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#34C759',
  error: '#FF3B30',
  white: '#ffffff',
  separator: '#E5E5EA',
};

const DarkColors = {
  primary: '#5B5FEF', // Improved Indigo
  secondary: '#a855f7',
  background: '#121212', // User specified
  card: '#1E1E1E', // User specified
  text: '#FFFFFF', // User specified
  textSecondary: '#8E8E93',
  border: '#38383A',
  success: '#32D74B',
  error: '#FF453A',
  white: '#ffffff',
  separator: '#38383A',
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DarkColors : LightColors;

  return {
    isDark,
    colors,
    typography: {
      h1: { fontSize: 34, fontWeight: '800', color: colors.text, letterSpacing: -1 } as TextStyle,
      h2: { fontSize: 24, fontWeight: '700', color: colors.text, letterSpacing: -0.5 } as TextStyle,
      h3: { fontSize: 20, fontWeight: '600', color: colors.text } as TextStyle,
      body: { fontSize: 17, color: colors.text } as TextStyle,
      caption: { fontSize: 13, color: colors.textSecondary } as TextStyle,
      label: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase' } as TextStyle,
    },
  };
};

// For backward compatibility during migration
export const Colors = LightColors;
export const Typography = {
  h1: { fontSize: 32, fontWeight: '700', color: '#0f172a' } as TextStyle,
  h2: { fontSize: 24, fontWeight: '600', color: '#0f172a' } as TextStyle,
  body: { fontSize: 16, color: '#0f172a' } as TextStyle,
  caption: { fontSize: 14, color: '#64748b' } as TextStyle,
} as any;
