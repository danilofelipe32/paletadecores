
import React, { useState, useEffect } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import CopyIcon from './icons/CopyIcon';
import { hexToRgb, rgbToCmyk } from '../services/colorService';
import type { RGBColor, CMYKColor } from '../types';

interface ColorCardProps {
    color: string;
}

const ColorValue: React.FC<{ label: string; value: string }> = ({ label, value }) => {
    const [isCopied, copy] = useCopyToClipboard();

    return (
        <div className="flex items-center justify-between text-sm">
            <span className="font-mono text-slate-400 w-12">{label}</span>
            <span className="font-mono text-slate-200 flex-grow">{value}</span>
            <button 
                onClick={() => copy(value)}
                className="p-1 rounded-md hover:bg-white/20 transition-colors"
                aria-label={`Copiar ${label} ${value}`}
            >
                {isCopied ? (
                    <span className="text-xs text-blue-300">Copiado!</span>
                ) : (
                    <CopyIcon className="w-4 h-4 text-slate-400 hover:text-white" />
                )}
            </button>
        </div>
    );
};

const ColorCard: React.FC<ColorCardProps> = ({ color }) => {
    const [rgb, setRgb] = useState<RGBColor | null>(null);
    const [cmyk, setCmyk] = useState<CMYKColor | null>(null);

    useEffect(() => {
        const newRgb = hexToRgb(color);
        if (newRgb) {
            setRgb(newRgb);
            setCmyk(rgbToCmyk(newRgb));
        }
    }, [color]);

    const rgbString = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '...';
    const cmykString = cmyk ? `${cmyk.c}, ${cmyk.m}, ${cmyk.y}, ${cmyk.k}` : '...';

    return (
        <div 
            className="relative flex-1 min-h-[300px] lg:min-h-[400px] flex flex-col justify-end transition-all duration-300 ease-in-out transform hover:-translate-y-2"
            style={{ backgroundColor: color }}
        >
            <div className="bg-slate-900/70 p-4 backdrop-blur-sm space-y-2">
                <ColorValue label="HEX" value={color.toUpperCase()} />
                <ColorValue label="RGB" value={rgbString} />
                <ColorValue label="CMYK" value={cmykString} />
            </div>
        </div>
    );
};

interface PaletteDisplayProps {
    palette: string[];
    name: string;
}

const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ palette, name }) => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 h-full">
            <div className="flex items-center mb-6">
                <h2 className="text-2xl font-semibold text-slate-200 truncate">
                    {name}
                </h2>
            </div>
            <div className="flex flex-col md:flex-row gap-0.5 rounded-lg overflow-hidden">
                {palette.map((color, index) => (
                    <ColorCard key={`${color}-${index}`} color={color} />
                ))}
            </div>
        </div>
    );
};

export default PaletteDisplay;