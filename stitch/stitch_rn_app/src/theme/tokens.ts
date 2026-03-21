import { TextStyle, ViewStyle } from 'react-native';

export const COLORS = {
  onPrimaryFixed: '#00492e',
  onSecondaryFixedVariant: '#27673d',
  errorDim: '#67040d',
  onPrimaryContainer: '#005e3d',
  surfaceContainerHighest: '#dce5e0',
  onPrimaryFixedVariant: '#0d6945',
  primaryFixed: '#a2f4c6',
  errorContainer: '#fa746f',
  inverseOnSurface: '#9a9e9b',
  secondaryContainer: '#aef2bc',
  onSurface: '#2c3431',
  secondary: '#2b6b40',
  primaryContainer: '#a2f4c6',
  secondaryFixed: '#aef2bc',
  inversePrimary: '#a7facc',
  inverseSurface: '#0b0f0e',
  tertiaryDim: '#4a564d',
  surface: '#f7faf7',
  surfaceBright: '#f7faf7',
  surfaceContainer: '#e9efeb',
  onSecondaryContainer: '#1b5d34',
  onSurfaceVariant: '#58615e',
  onTertiary: '#effcf0',
  surfaceContainerLowest: '#ffffff',
  onBackground: '#2c3431',
  onTertiaryFixedVariant: '#5b675e',
  tertiaryFixedDim: '#d9e6da',
  surfaceContainerLow: '#f0f5f1',
  onPrimary: '#e6ffed',
  surfaceTint: '#146c49',
  tertiaryContainer: '#e7f4e8',
  secondaryFixedDim: '#a0e4ae',
  primary: '#146c49',
  onError: '#fff7f6',
  outline: '#747d79',
  outlineVariant: '#abb4b0',
  onErrorContainer: '#6e0a12',
  secondaryDim: '#1d5f35',
  primaryFixedDim: '#94e5b9',
  primaryDim: '#00603e',
  onSecondaryFixed: '#004a23',
  tertiary: '#566259',
  onTertiaryFixed: '#3f4b42',
  surfaceVariant: '#dce5e0',
  surfaceContainerHigh: '#e3eae6',
  surfaceDim: '#d3dcd8',
  tertiaryFixed: '#e7f4e8',
  error: '#a83836',
  background: '#f7faf7',
  onSecondary: '#e8ffe8',
  onTertiaryContainer: '#515d54',
} as const;

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
} as const;

export const RADII = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
} as const;

export const FONT_FAMILY = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semiBold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
} as const;

type TypographyMap = {
  [key: string]: TextStyle;
};

export const TYPOGRAPHY: TypographyMap = {
  displayMd: {
    fontFamily: FONT_FAMILY.extraBold,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
  },
  headlineSm: {
    fontFamily: FONT_FAMILY.extraBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  titleMd: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 18,
    lineHeight: 24,
  },
  bodyLg: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  labelMd: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 13,
    lineHeight: 18,
  },
  labelSm: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 11,
    lineHeight: 14,
  },
};

export const SHADOWS: Record<string, ViewStyle> = {
  ambient: {
    shadowColor: COLORS.onSurface,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  lifted: {
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
};
