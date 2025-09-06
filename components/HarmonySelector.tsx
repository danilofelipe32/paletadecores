import React from 'react';
import type { Harmony } from '../types';
import { HARMONY_RULES } from '../constants';

interface HarmonySelectorProps {
    selectedHarmony: Harmony;
    onHarmonyChange: (harmony: Harmony) => void;
}

const HarmonySelector: React.FC<HarmonySelectorProps> = ({ selectedHarmony, onHarmonyChange }) => {
    return (
        <div>
            <label htmlFor="harmony-rule" className="block text-sm font-medium text-slate-400 mb-2">Regra de Harmonia</label>
            <select
                id="harmony-rule"
                value={selectedHarmony}
                onChange={(e) => onHarmonyChange(e.target.value as Harmony)}
                className="w-full bg-slate-700 border border-slate-600 text-white text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 placeholder-slate-400"
            >
                {HARMONY_RULES.map((rule) => (
                    <option key={rule.value} value={rule.value}>
                        {rule.label}
                    </option>
                ))}
            </select>
            <p className="text-sm text-slate-500 mt-2">
                {HARMONY_RULES.find(r => r.value === selectedHarmony)?.description}
            </p>
        </div>
    );
};

export default HarmonySelector;