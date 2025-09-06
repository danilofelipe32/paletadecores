import type { Harmony } from './types';

interface HarmonyRule {
  value: Harmony;
  label: string;
  description: string;
}

export const HARMONY_RULES: HarmonyRule[] = [
  { value: 'complementary', label: 'Complementar', description: 'Cores opostas no círculo cromático.' },
  { value: 'analogous', label: 'Análogas', description: 'Cores adjacentes no círculo cromático.' },
  { value: 'triadic', label: 'Triádica', description: 'Três cores igualmente espaçadas.' },
  { value: 'split-complementary', label: 'Complementar Dividida', description: 'Uma cor base e duas adjacentes à sua complementar.' },
  { value: 'tetradic', label: 'Tetrádica', description: 'Quatro cores em dois pares complementares.' },
  { value: 'monochromatic', label: 'Monocromática', description: 'Variações de luminosidade e saturação de uma cor.' },
  { value: 'shades', label: 'Tons', description: 'Variações de luminosidade de um único matiz.' },
];