
import { GoogleGenAI } from "@google/genai";
import { Commodity } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


export const getAIForecastSummary = async (commodity: Commodity, period: number): Promise<string> => {
    console.log(`Fetching AI summary for ${commodity} over ${period} days...`);
    
    try {
        const prompt = `Provide a concise price forecast summary for ${commodity} for the next ${period} days for an Indian farmer. Include a percentage prediction and a confidence level.`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching AI forecast summary:", error);
        return "Could not load AI summary at this time. Please try again later.";
    }
};

export interface ChatResponse {
    text: string;
    sources?: { title: string; uri: string }[];
}

export const getChatResponse = async (prompt: string): Promise<ChatResponse> => {
    console.log(`Getting chat response for: "${prompt}"`);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are AgriSure Assistant, a friendly and knowledgeable AI expert in agricultural commodity markets, specifically for Indian farmers. Provide clear, concise answers. Format your responses using markdown for better readability. For example, use **bold** for emphasis.",
                tools: [{googleSearch: {}}],
            },
        });
        
        const text = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const sources = groundingChunks
            ?.map(chunk => chunk.web)
            .filter((web): web is { uri: string, title: string } => !!(web?.uri && web?.title))
            .map(web => ({ title: web.title, uri: web.uri })) ?? [];
        
        const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

        return { text, sources: uniqueSources.length > 0 ? uniqueSources : undefined };
    } catch (error) {
        console.error("Error fetching chat response:", error);
        return { text: "Sorry, I'm having trouble connecting right now. Please try again later."};
    }
};