export interface HSLColor {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  l: number; // Lightness (0-100)
}

export interface RGBColor {
  r: number; // Red (0-255)
  g: number; // Green (0-255)
  b: number; // Blue (0-255)
}

export interface CMYKColor {
    c: number; // Cyan (0-100)
    m: number; // Magenta (0-100)
    y: number; // Yellow (0-100)
    k: number; // Key (black) (0-100)
}

export type Harmony =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'monochromatic'
  | 'shades';

export interface SavedPalette {
    id: string;
    colors: string[];
    harmony: Harmony;
    baseColor: HSLColor;
}