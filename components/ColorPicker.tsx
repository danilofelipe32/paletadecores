import React, { useState, useEffect } from 'react';
import type { HSLColor } from '../types';
import { hslToHex, hexToHsl } from '../services/colorService';
import ColorWheel from './ColorWheel';

interface ColorPickerProps {
    color: HSLColor;
    onColorChange: (color: HSLColor) => void;
    palette: string[];
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onColorChange, palette }) => {
    const [hexValue, setHexValue] = useState(hslToHex(color));

    useEffect(() => {
        setHexValue(hslToHex(color));
    }, [color]);

    const handleSaturationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onColorChange({ ...color, s: Number(e.target.value) });
    };

    const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onColorChange({ ...color, l: Number(e.target.value) });
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHex = e.target.value;
        setHexValue(newHex);
        if (/^#[0-9A-F]{6}$/i.test(newHex)) {
            const newHsl = hexToHsl(newHex);
            if (newHsl) {
                onColorChange(newHsl);
            }
        }
    };

    return (
        <div className="space-y-6">
            <ColorWheel
                size={240}
                color={color}
                palette={palette}
                onColorChange={onColorChange}
            />
            <div className="space-y-4">
                 <div>
                    <label htmlFor="base-color-display" className="block text-sm font-medium text-slate-400 mb-2">Cor Base</label>
                     <div className="relative">
                        <div className="w-full h-12 rounded-lg border-2 border-slate-600" style={{ backgroundColor: hexValue }}></div>
                        <input
                            id="base-color-display"
                            type="text"
                            value={hexValue}
                            onChange={handleHexChange}
                            className="absolute inset-0 w-full h-full bg-transparent text-white text-center font-mono text-lg tracking-wider border-none focus:outline-none focus:ring-0"
                        />
                    </div>
                </div>
                
                <div className="space-y-3">
                    <label htmlFor="saturation" className="block text-sm font-medium text-slate-400">Saturação ({color.s})</label>
                    <input
                        id="saturation"
                        type="range"
                        min="0"
                        max="100"
                        value={color.s}
                        onChange={handleSaturationChange}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, hsl(${color.h}, 0%, ${color.l}%), hsl(${color.h}, 100%, ${color.l}%))` }}
                    />
                </div>

                <div className="space-y-3">
                    <label htmlFor="lightness" className="block text-sm font-medium text-slate-400">Luminosidade ({color.l})</label>
                    <input
                        id="lightness"
                        type="range"
                        min="0"
                        max="100"
                        value={color.l}
                        onChange={handleLightnessChange}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #000, hsl(${color.h}, ${color.s}%, 50%), #fff)` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;