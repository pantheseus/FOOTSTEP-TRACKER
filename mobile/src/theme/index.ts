import { TextStyle } from 'react-native';

export const Colors = {
  primary: '#6366f1', // Indigo
  secondary: '#a855f7', // Purple
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#0f172a',
  textSecondary: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  error: '#ef4444',
  white: '#ffffff',
};

interface TypographyType {
  h1: TextStyle;
  h2: TextStyle;
  body: TextStyle;
  caption: TextStyle;
}

export const Typography: TypographyType = {
  h1: { fontSize: 32, fontWeight: '700', color: Colors.text },
  h2: { fontSize: 24, fontWeight: '600', color: Colors.text },
  body: { fontSize: 16, color: Colors.text },
  caption: { fontSize: 14, color: Colors.textSecondary },
};
