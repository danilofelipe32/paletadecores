import React from 'react';
import type { SavedPalette } from '../types';
import SavedPaletteItem from './SavedPaletteItem';

interface SavedPalettesListProps {
    savedPalettes: SavedPalette[];
    onLoadPalette: (palette: Omit<SavedPalette, 'id'>) => void;
    onDeletePalette: (id: string) => void;
}

const SavedPalettesList: React.FC<SavedPalettesListProps> = ({ savedPalettes, onLoadPalette, onDeletePalette }) => {
    if (savedPalettes.length === 0) {
        return (
            <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 h-full">
                <h3 className="text-xl font-semibold text-slate-200 mb-4">Paletas Salvas</h3>
                <p className="text-slate-400">Nenhuma paleta salva ainda. Salve uma paleta para vê-la aqui!</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700 h-full">
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Paletas Salvas</h3>
            <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {savedPalettes.map((palette) => (
                    <SavedPaletteItem
                        key={palette.id}
                        palette={palette}
                        onLoadPalette={onLoadPalette}
                        onDeletePalette={onDeletePalette}
                    />
                ))}
            </ul>
        </div>
    );
};

export default SavedPalettesList;