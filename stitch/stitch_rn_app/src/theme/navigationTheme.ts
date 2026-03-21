import { DefaultTheme, Theme } from '@react-navigation/native';
import { COLORS } from './tokens';

export const navigationTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.surface,
    card: COLORS.surfaceContainerLowest,
    text: COLORS.onSurface,
    border: COLORS.outlineVariant,
    primary: COLORS.primary,
    notification: COLORS.error,
  },
};
