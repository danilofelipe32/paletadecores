
import type { HSLColor, RGBColor, Harmony, CMYKColor } from '../types';

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 360], [0, 100], and [0, 100] and
 * returns r, g, and b in the set [0, 255].
 */
export const hslToRgb = ({ h, s, l }: HSLColor): RGBColor => {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
};

export const rgbToHex = ({ r, g, b }: RGBColor): string => {
  const toHex = (c: number) => `0${c.toString(16)}`.slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const hslToHex = (hsl: HSLColor): string => {
  return rgbToHex(hslToRgb(hsl));
};

export const generatePalette = (baseColor: HSLColor, harmony: Harmony): string[] => {
  const { h, s, l } = baseColor;
  let paletteHsl: HSLColor[] = [];

  switch (harmony) {
    case 'complementary':
      paletteHsl = [
        { h, s, l: Math.max(15, l - 30) },
        { h, s, l: Math.max(25, l - 15) },
        baseColor,
        { h: (h + 180) % 360, s, l },
        { h: (h + 180) % 360, s, l: Math.max(25, l - 15) },
      ];
      break;
    case 'analogous':
      paletteHsl = [
        { h: (h - 60 + 360) % 360, s, l },
        { h: (h - 30 + 360) % 360, s, l },
        baseColor,
        { h: (h + 30) % 360, s, l },
        { h: (h + 60) % 360, s, l },
      ];
      break;
    case 'triadic':
      paletteHsl = [
        baseColor,
        { h: (h + 120) % 360, s, l },
        { h: (h + 240) % 360, s, l },
        { h, s, l: Math.max(20, l - 25) },
        { h: (h + 120) % 360, s, l: Math.max(20, l - 25) },
      ];
      break;
    case 'split-complementary':
      paletteHsl = [
        baseColor,
        { h: (h + 150) % 360, s, l },
        { h: (h + 210) % 360, s, l },
        { h: (h + 150) % 360, s, l: Math.max(20, l - 25) },
        { h, s, l: Math.max(20, l - 35) },
      ];
      break;
    case 'tetradic':
      paletteHsl = [
        baseColor,
        { h: (h + 90) % 360, s, l },
        { h: (h + 180) % 360, s, l },
        { h: (h + 270) % 360, s, l },
        { h, s, l: Math.max(20, l - 25) },
      ];
      break;
    case 'monochromatic':
       paletteHsl = [
        { h, s: Math.max(0, s - 30), l: Math.min(100, l + 30) },
        { h, s: Math.max(0, s - 15), l: Math.min(100, l + 15) },
        baseColor,
        { h, s: Math.min(100, s + 15), l: Math.max(0, l - 15) },
        { h, s: Math.min(100, s + 30), l: Math.max(0, l - 30) },
      ];
      break;
    case 'shades':
        paletteHsl = [
            { h, s, l: Math.min(95, l + 25) },
            { h, s, l: Math.min(95, l + 15) },
            baseColor,
            { h, s, l: Math.max(10, l - 15) },
            { h, s, l: Math.max(10, l - 25) },
        ];
        break;
  }

  return paletteHsl.map(hslToHex);
};

export const hexToRgb = (hex: string): RGBColor | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Converts an RGB color value to HSL.
 */
export const rgbToHsl = ({ r, g, b }: RGBColor): HSLColor => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    let l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
};

export const hexToHsl = (hex: string): HSLColor | null => {
    const rgb = hexToRgb(hex);
    return rgb ? rgbToHsl(rgb) : null;
};

export const rgbToCmyk = ({ r, g, b }: RGBColor): CMYKColor => {
    const r_ = r / 255;
    const g_ = g / 255;
    const b_ = b / 255;

    const k = 1 - Math.max(r_, g_, b_);

    if (k === 1) {
        return { c: 0, m: 0, y: 0, k: 100 };
    }

    const c = (1 - r_ - k) / (1 - k);
    const m = (1 - g_ - k) / (1 - k);
    const y = (1 - b_ - k) / (1 - k);

    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100),
    };
};