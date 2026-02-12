import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, RecommendationResult, Language, Recipe } from "../types";

/**
 * Helper to clean Markdown code blocks from JSON string
 */
const cleanJsonString = (str: string): string => {
    return str.replace(/```json/g, '').replace(/```/g, '').trim();
};

/**
 * Compresses a base64 image string using HTML Canvas
 * Target: JPEG format, 0.5 quality to save LocalStorage space
 */
export const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            // Scale down if too large (max width 600px for storage)
            const maxWidth = 600;
            const scale = maxWidth / img.width;
            const width = scale < 1 ? maxWidth : img.width;
            const height = scale < 1 ? img.height * scale : img.height;

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(base64Str); 
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            // Export as JPEG with 0.5 quality for storage optimization
            resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        img.onerror = () => {
            console.error("Image compression failed");
            resolve(base64Str);
        };
    });
};

/**
 * Helper to compress the entire result object for LocalStorage
 */
export const compressRecommendationResult = async (result: RecommendationResult): Promise<RecommendationResult> => {
    const compressed = { ...result };
    
    // Compress Outfit Image
    if (compressed.outfit.image.startsWith('data:image')) {
        compressed.outfit.image = await compressImage(compressed.outfit.image);
    }

    // Compress Recipe Image
    if (compressed.recipe.image.startsWith('data:image')) {
        compressed.recipe.image = await compressImage(compressed.recipe.image);
    }

    return compressed;
};

/**
 * Helper to generate an image using Gemini 2.5 Flash Image
 * NOW RETURNS HIGH QUALITY (No Compression)
 */
const generateImage = async (prompt: string): Promise<string | null> => {
    try {
        // FIX: Initialize AI client here to ensure env var is ready
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        console.log(`Generating image with prompt: ${prompt.substring(0, 50)}...`);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            }
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    // Return Original High Quality PNG
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        console.warn("Image generation returned no inlineData");
        return null;
    } catch (e) {
        console.error("Image Gen Failed:", e);
        return null;
    }
}

export const generateFridgeRecipe = async (ingredients: string, user: UserProfile): Promise<Recipe | null> => {
    // FIX: Initialize AI client here
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API Key is missing in generateFridgeRecipe");
        return null;
    }
    const ai = new GoogleGenAI({ apiKey });

    const languageName = user.language === Language.KO ? 'Korean' : 'English';
    const prompt = `
        You are a creative chef.
        User Ingredients: ${ingredients}.
        User Preferences: ${user.tastes?.join(', ')}.
        Goal: Create a healthy, delicious recipe using MAINLY the provided ingredients (you can add common pantry staples like oil, salt, spices).

        Output JSON format ONLY:
        {
            "title": "string",
            "calories": number,
            "protein": "string",
            "time": "string",
            "badge": "string (e.g., 'Fridge Rescue')",
            "ingredients": [{"name": "string", "amount": "string"}],
            "steps": ["string"]
        }
        Language: ${languageName}.
    `;

    try {
        const textResponse = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        if (!textResponse.text) throw new Error("No text response");
        const data = JSON.parse(cleanJsonString(textResponse.text));

        // Generate Image
        const imagePrompt = `Professional food photography, overhead shot of ${data.title}. 
        Ingredients visible: ${data.ingredients.slice(0,3).map((i: any) => i.name).join(', ')}.
        Studio lighting, appetizing, 4k.`;
        
        const image = await generateImage(imagePrompt);

        return {
            ...data,
            id: `ai-fridge-${Date.now()}`,
            tags: ['AI_FRIDGE'],
            image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600',
            ingredients: (data.ingredients || []).map((i: any) => ({ ...i, image: '' }))
        };

    } catch (e) {
        console.error("Fridge Recipe Gen Failed:", e);
        return null;
    }
};

export const fetchAIRecommendations = async (user: UserProfile): Promise<RecommendationResult | null> => {
  // FIX: Initialize AI client here
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("No API Key found. Check metadata or env.");
    return null;
  }
  const ai = new GoogleGenAI({ apiKey });

  const languageName = user.language === Language.KO ? 'Korean' : 'English';

  // 1. Generate Text Data (JSON)
  const textPrompt = `
    You are a hyper-personalized lifestyle coach. 
    User Profile:
    - MBTI: ${user.mbti}
    - Mood: ${user.currentMood}
    - Season: ${user.currentSeason}
    - Body Type: ${user.boneStructure}
    - Target Area: ${user.targetArea}
    - Height/Weight: ${user.height}cm / ${user.weight}kg

    Task: Generate a valid JSON object containing a Quote, a Recipe, an Outfit, and a Workout routine.
    
    Constraints:
    - Language: ALL TEXT MUST BE IN ${languageName.toUpperCase()}.
    - Tone: Professional yet encouraging.
    
    Specific Requirements:
    1. **Outfit Description**: Write a detailed styling advice paragraph (approx. 40-60 words). Explain WHY this specific outfit works for the '${user.boneStructure}' body type and how it helps the '${user.targetArea}'. Mention fabric textures or color theory suitable for ${user.currentSeason}.
    2. **Recipe**: Must be a complete meal. 
       - 'steps': Provide 4-6 detailed steps. Include specific actions like "Sauté for 3 mins until golden".
       - 'ingredients': List 4-6 key ingredients with specific amounts.
    3. **Workout**: 3 exercises focused specifically on '${user.targetArea}'.

    JSON Schema:
    {
      "quote": { "text": "string", "author": "string" },
      "recipe": { 
        "title": "string", "calories": number, "protein": "string", "time": "string", 
        "badge": "string", 
        "ingredients": [{"name": "string", "amount": "string"}], 
        "steps": ["string"] 
      },
      "outfit": { 
        "title": "string", "description": "string", "proTip": "string", 
        "hashtags": ["string"], 
        "items": [{"name": "string", "type": "string"}] 
      },
      "workout": { 
        "title": "string", "duration": "string", "intensity": "Low" | "Med" | "High", 
        "exercises": [{"name": "string", "reps": "string", "description": "string"}] 
      }
    }
  `;

  try {
    console.log("Requesting Text Generation...");
    const textResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: textPrompt,
      config: { responseMimeType: "application/json" }
    });

    if (!textResponse.text) throw new Error("No text response from Gemini");
    
    const cleanedText = cleanJsonString(textResponse.text);
    let data;
    try {
        data = JSON.parse(cleanedText);
    } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Failed to parse AI response");
    }

    console.log("Text Generation Successful. Prompting Images...");

    // Step 2: Image Generation
    const outfitPrompt = `Fashion photography, full body shot of a model with ${user.boneStructure} body type wearing ${data.outfit.title}. 
    Items: ${data.outfit.items.map((i: any) => i.name).join(', ')}.
    Season: ${user.currentSeason}. Natural lighting, high fashion editorial, clean background, 8k resolution.`;
    
    const recipePrompt = `Professional food photography, overhead shot of ${data.recipe.title}. 
    Ingredients: ${data.recipe.ingredients.slice(0,3).map((i: any) => i.name).join(', ')}.
    Studio lighting, appetizing, 4k, shallow depth of field.`;

    // Execute parallel requests
    const [outfitImage, recipeImage] = await Promise.all([
        generateImage(outfitPrompt),
        generateImage(recipePrompt)
    ]);

    // Check if critical images failed
    if (!outfitImage && !recipeImage) {
        console.warn("Both image generations failed. Returning null to trigger fallback.");
        return null; 
    }

    const result: RecommendationResult = {
        quote: data.quote,
        recipe: {
            ...data.recipe,
            id: `ai-recipe-${Date.now()}`,
            tags: [user.currentMood, user.currentSeason],
            image: recipeImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600', 
            ingredients: (data.recipe.ingredients || []).map((i: any) => ({ ...i, image: '' }))
        },
        outfit: {
            ...data.outfit,
            id: `ai-outfit-${Date.now()}`,
            tags: [user.currentSeason, user.targetArea],
            image: outfitImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600',
        },
        workout: {
            ...data.workout,
            id: `ai-workout-${Date.now()}`,
            tags: [user.targetArea],
            exercises: (data.workout.exercises || []).map((ex: any) => ({
                ...ex,
                image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=200' 
            }))
        }
    };

    return result;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};