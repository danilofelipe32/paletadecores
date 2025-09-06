import React from 'react';
import type { SavedPalette } from '../types';
import TrashIcon from './icons/TrashIcon';
import CopyIcon from './icons/CopyIcon';
import { HARMONY_RULES } from '../constants';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

interface SavedPaletteItemProps {
    palette: SavedPalette;
    onLoadPalette: (palette: Omit<SavedPalette, 'id'>) => void;
    onDeletePalette: (id: string) => void;
}

const SavedPaletteItem: React.FC<SavedPaletteItemProps> = ({ palette, onLoadPalette, onDeletePalette }) => {
    const [isCopied, copy] = useCopyToClipboard();

    const handleCopyClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent onLoadPalette from firing
        copy(palette.colors.join(', '));
    };
    
    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDeletePalette(palette.id);
    };

    return (
        <li 
            className="group bg-slate-700/50 p-3 rounded-lg flex items-center justify-between transition-colors hover:bg-slate-700 cursor-pointer"
            onClick={() => onLoadPalette({
                colors: palette.colors,
                harmony: palette.harmony,
                baseColor: palette.baseColor,
            })}
        >
            <div className="flex-grow space-y-2">
                 <div className="flex items-center gap-2">
                    {palette.colors.slice(0, 5).map((color, index) => (
                        <div key={index} className="w-6 h-6 rounded-full border border-slate-800/50" style={{ backgroundColor: color }} />
                    ))}
                </div>
                <p className="text-slate-300 text-sm font-semibold">
                    {HARMONY_RULES.find(r => r.value === palette.harmony)?.label || palette.harmony}
                </p>
            </div>
            <div className="flex items-center ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleCopyClick}
                    className="p-2 rounded-md text-slate-400 hover:text-blue-400 hover:bg-blue-500/10"
                    aria-label="Copiar cores da paleta"
                >
                    {isCopied ? 
                        <span className="text-xs text-blue-300 font-semibold">Copiado!</span> : 
                        <CopyIcon className="w-5 h-5" />
                    }
                </button>
                <button
                    onClick={handleDeleteClick}
                    className="p-2 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    aria-label="Deletar paleta"
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </li>
    );
};

export default SavedPaletteItem;