import { GoogleGenAI, Type } from "@google/genai";

const apikey= process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({apiKey});
const prompt="create a ai course post"
const tone="professional"

   const textResponse = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: `Generate a social media post based on this prompt: "${prompt}". Tone: ${tone}. Include relevant hashtags.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        content: { type: Type.STRING, description: "The written text of the social media post." },
                        imagePrompt: { type: Type.STRING, description: "A highly descriptive, vivid snapshot prompt for an image generator that compliments the text post." }
                    },
                    required: ["content", "imagePrompt"],
                }
            }
        });
console.log(textResponse.text);