import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey });

async function listModels() {
    const modelsToTest = [
        "gemini-2.5-flash",
        "gemini-2.0-flash-lite",
        "gemini-3.5-flash"
    ];

    for (const model of modelsToTest) {
        try {
            const textResponse = await genAI.models.generateContent({
                model: model,
                contents: "Hello"
            });
            console.log(`${model} success:`, textResponse.text);
        } catch (e) {
            console.error(`${model} failed:`, e.message);
        }
    }
}

listModels();
