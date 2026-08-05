import path from "node:path";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "node:fs";
import os from "node:os";
import { Response } from 'express';
import cloudinary from "../config/cloudinary.js";
import zernio from "../config/zernio.js";
import { Generation } from "../models/Generation.js";
import { Post } from "../models/Post.js";
import multer from "multer";
import { uploadBufferToCloudinary } from "../utils/uploadBuffertoCloudainary.js";


// Generate post
//POST /api/posts/generate
export const generatePost = async (req: AuthRequest, res: Response): Promise<void> => {
    const { prompt, tone, generateImage } = req.body;
    try {
        // 1. Move early validation to the top
        if (!prompt) {
            res.status(400).json({ message: "Prompt is required" });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            res.status(500).json({ message: "GEMINI_API_KEY is not configured" });
            return;
        }

        const genAI = new GoogleGenAI({ apiKey });


        let content = "";
        let imagePrompt = "";

        // 2. Generate text using Gemini's native structured JSON schemas
        const textResponse = await genAI.models.generateContent({
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

        if (textResponse?.text) {
            try {
                const parsed = JSON.parse(textResponse.text);
                content = parsed.content || "";
                imagePrompt = parsed.imagePrompt || "";
            } catch (error) {
                content = textResponse.text || "";
            }
        }

        let mediaUrl = "";
        let mediaType = "none";

        // 3. Conditional Image Generation
        if (generateImage && imagePrompt) {
            try {
                const imageResponse = await genAI.models.generateImages({
                    model: "imagen-3.0-generate-001",
                    prompt: imagePrompt,
                    config: {
                        numberOfImages: 1,
                        aspectRatio: "1:1",
                        outputMimeType: "image/jpeg",
                    }
                });

                // Correct mapping structure for @google/genai SDK
                if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
                    const generatedImage = imageResponse.generatedImages[0];
                    const imageBytes = generatedImage.image?.imageBytes;
                    if (imageBytes) {
                        const buffer = Buffer.from(imageBytes, 'base64');


                        // Upload buffer to Cloudinary
                        const uploadResult = await uploadBufferToCloudinary(buffer,
                            "social-scheduler/generated-images"
                        );

                        // Assign returned secure asset link
                        mediaUrl = uploadResult.secure_url;
                        mediaType = "image";

                    }
                }
            } catch (error) {
                console.error("Error generating image via Imagen API:", error);
                // Non-blocking catch so text generation can still save if image generation breaks
            }
        }

        // 4. Save to Database using the locally populated variables
        const newGeneration = await Generation.create({
            user: req.user?._id,
            prompt,
            content,
            mediaUrl,
            mediaType: mediaType as "none" | "image" | "video",
            tone
        });

        // 5. Send Successful API Response
        res.status(201).json({
            success: true,
            data: newGeneration
        });


    } catch (error: any) {
        console.error("Global endpoint execution failed:", error);
        if (error?.status === 429 || error?.message?.includes("Quota exceeded") || error?.message?.includes("429")) {
            res.status(429).json({ message: "Gemini API rate limit exceeded. Please wait about 30 seconds before retrying." });
            return;
        }
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


//GET generations
//POST /api/posts/generate
export const getGenrations = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const generation = await Generation.find({ user: req.user?._id }).sort({ createdAt: -1 })

        if (!generation) {
            res.status(404).json({ message: "No generations found" })
            return
        }
        res.status(200).json({ success: true, data: generation })
    } catch (error) {
        console.error("Error fetching generations:", error)
        res.status(500).json({ message: "Internal Server Error" })

    }
}

//Get posts
//GET /api/posts
export const getPost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const posts = await Post.find({ user: req.user._id })
        res.json({ success: true, data: posts })
    } catch (error) {
        console.error("Error fetching posts:", error)
        res.status(500).json({ message: "Internal Server Error" })

    }
}

//Schedule post
//GET /api/posts
export const schedulePost = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { content, platforms, scheduledFor, status } = req.body;

        // Parse platform if it comes as a stringified array or comma-separated string from FormData
        let parsedPlatforms: string[] = [];
        if (typeof platforms === "string") {
            try {
                const parsed = JSON.parse(platforms);
                parsedPlatforms = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                parsedPlatforms = platforms.split(",").map((p: string) => p.trim()).filter(Boolean);
            }
        } else if (Array.isArray(platforms)) {
            parsedPlatforms = platforms;
        }

        let mediaUrl: string | undefined = req.body.mediaUrl;
        let mediaType: "image" | "video" | "none" = req.body.mediaType;

        if (req.file) {
            const result = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { resource_type: "auto", folder: "social-scheduler/generate-image" },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                stream.end(req.file!.buffer);
            });
            mediaUrl = result.secure_url;
            mediaType = result.resource_type as "image" | "video";
        }

        const post = await Post.create({
            user: req.user._id,
            content,
            mediaUrl,
            mediaType,
            platforms: parsedPlatforms as ("instagram" | "twitter" | "facebook" | "X" | "linkedin")[],
            scheduledFor,
            status
        });
        res.json({ success: true, data: post });
    } catch (error) {
        console.error("Error scheduling post:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}