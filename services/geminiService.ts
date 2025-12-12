
import { GoogleGenAI } from "@google/genai";

// Função para obter a API Key de forma resiliente
const getApiKey = (): string | undefined => {
  try {
    // Tenta obter do process.env injetado pelo ambiente ou pelo polifill
    return (window as any).process?.env?.API_KEY || (process as any)?.env?.API_KEY;
  } catch (e) {
    return undefined;
  }
};

export const refineNotes = async (currentNotes: string, projectType: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return currentNotes;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Melhore este texto de observações de orçamento para impermeabilização Kolbtec: "${currentNotes}". Tipo: ${projectType}. Seja técnico e profissional.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || currentNotes;
  } catch (error) {
    console.error("Erro Gemini:", error);
    return currentNotes;
  }
};

export const suggestDescription = async (keyword: string): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) return keyword;
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Descreva tecnicamente em uma frase o serviço de impermeabilização: ${keyword}`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || keyword;
    } catch (e) {
      return keyword;
    }
};
