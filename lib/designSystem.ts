import designSystemRaw from '@/docs-private/design_system.json';

export const designSystem = designSystemRaw;

// Type-safe color access
export const colors = {
  primary: designSystem.colorPalette.primary.hex,
  secondary: designSystem.colorPalette.secondary.hex,
  background: designSystem.colorPalette.background.hex,
  accentAction: designSystem.colorPalette.accentAction.hex,
  text: designSystem.colorPalette.text.hex,
} as const;

// Typography
export const typography = {
  headings: designSystem.typography.headings.fontFamily,
  body: designSystem.typography.body.fontFamily,
} as const;

// Archetype information
export const brandArchetype = {
  primary: designSystem.archetype.primary,
  secondary: designSystem.archetype.secondary,
} as const;

export type DesignSystem = typeof designSystem;
export type Colors = typeof colors;
export type Typography = typeof typography;

