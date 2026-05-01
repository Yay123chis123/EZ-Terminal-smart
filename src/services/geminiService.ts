import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function generateCode(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Using flash for fast terminal-like response
      contents: `You are a professional software engineer. Generate only the code for the following request. Do not include excessive explanations unless necessary as comments within the code. Use markdown for the code block.
      
      Request: ${prompt}`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "No code generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to generate code. Please check your connection or prompt.");
  }
}
