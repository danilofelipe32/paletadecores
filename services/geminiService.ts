import { GoogleGenAI } from "@google/genai";

// Fix: Initialize the GoogleGenAI client as per the guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a creative name for a color palette using the Gemini API.
 * @param colors - An array of hex color strings.
 * @returns A promise that resolves to a string with the palette name.
 */
export const getPaletteName = async (colors: string[]): Promise<string> => {
    try {
        const prompt = `Gere um nome criativo e curto (2-4 palavras) para uma paleta de cores. A paleta é composta pelas seguintes cores hexadecimais: ${colors.join(', ')}. Responda apenas com o nome da paleta.`;
        
        // Fix: Use ai.models.generateContent to generate palette name, following current best practices.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.8,
                topP: 1,
                topK: 1,
                maxOutputTokens: 20,
            }
        });

        // Fix: Extract text correctly from the response object using the .text property.
        const text = response.text.trim();
        // Remove quotes if the model returns them
        return text.replace(/["']/g, '');

    } catch (error) {
        console.error("Error generating palette name:", error);
        return "Paleta de Cores Vibrantes"; // Fallback name
    }
};
