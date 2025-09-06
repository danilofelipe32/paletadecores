import React, { useState, useEffect, useCallback } from 'react';
import ColorPicker from './components/ColorPicker';
import PaletteDisplay from './components/PaletteDisplay';
import HarmonySelector from './components/HarmonySelector';
import SavedPalettesList from './components/SavedPalettesList';
import { generatePalette } from './services/colorService';
import type { HSLColor, Harmony, SavedPalette } from './types';
import { HARMONY_RULES } from './constants';

const App: React.FC = () => {
    // Initial State
    const [baseColor, setBaseColor] = useState<HSLColor>({ h: 333, s: 93, l: 64 });
    const [harmony, setHarmony] = useState<Harmony>('analogous');
    const [palette, setPalette] = useState<string[]>([]);
    
    // Saved Palettes State & Logic
    const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>(() => {
        try {
            const item = window.localStorage.getItem('savedPalettes');
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
    }, [savedPalettes]);

    // Generate palette whenever color or harmony changes
    useEffect(() => {
        const newPalette = generatePalette(baseColor, harmony);
        setPalette(newPalette);
    }, [baseColor, harmony]);

    const handleSavePalette = () => {
        const newSavedPalette: SavedPalette = {
            id: new Date().toISOString(),
            colors: palette,
            harmony: harmony,
            baseColor: baseColor,
        };
        setSavedPalettes(prev => [newSavedPalette, ...prev]);
    };

    const handleDeletePalette = (id: string) => {
        setSavedPalettes(prev => prev.filter(p => p.id !== id));
    };

    const handleLoadPalette = useCallback((p: Omit<SavedPalette, 'id'>) => {
        setBaseColor(p.baseColor);
        setHarmony(p.harmony);
        setPalette(p.colors);
    }, []);

    const handleRandomPalette = useCallback(() => {
        const randomHue = Math.floor(Math.random() * 360);
        const randomSaturation = 40 + Math.floor(Math.random() * 60); // 40-100
        const randomLightness = 40 + Math.floor(Math.random() * 40); // 40-80
        const randomHarmony = HARMONY_RULES[Math.floor(Math.random() * HARMONY_RULES.length)].value;
        
        setBaseColor({ h: randomHue, s: randomSaturation, l: randomLightness });
        setHarmony(randomHarmony);
    }, []);

    const harmonyLabel = HARMONY_RULES.find(r => r.value === harmony)?.label || 'Paleta';

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans">
            <header className="py-6 px-4 md:px-8 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        Gerador de Paleta de Cores
                    </h1>
                     <div className="flex items-center gap-2">
                        <button 
                            onClick={handleRandomPalette}
                            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                            Aleatório
                        </button>
                        <button 
                            onClick={handleSavePalette}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                            Salvar Paleta
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <aside className="lg:col-span-1 space-y-8">
                    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
                        <ColorPicker
                            color={baseColor}
                            onColorChange={setBaseColor}
                            palette={palette}
                        />
                    </div>
                     <div className="bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-700">
                        <HarmonySelector
                            selectedHarmony={harmony}
                            onHarmonyChange={setHarmony}
                        />
                    </div>
                    <SavedPalettesList 
                        savedPalettes={savedPalettes}
                        onLoadPalette={handleLoadPalette}
                        onDeletePalette={handleDeletePalette}
                    />
                </aside>

                <section className="lg:col-span-2">
                    <PaletteDisplay
                        palette={palette}
                        name={`Paleta ${harmonyLabel}`}
                    />
                </section>
            </main>
        </div>
    );
};

export default App;