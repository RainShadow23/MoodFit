import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import { UserProfile, RecommendationResult, Language, Recipe, BoneStructure, Gender, AIProvider } from "../types";

// --- Model Configuration ---
const OPENAI_MODEL_GENERAL = "gpt-4o-mini";
const OPENAI_MODEL_STYLE = "gpt-5-mini"; // User specific request

// --- Image Utils (Preserved from AA.md) ---
export const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxWidth = 1024;
            const scale = maxWidth / img.width;
            const width = scale < 1 ? maxWidth : img.width;
            const height = scale < 1 ? img.height * scale : img.height;

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(base64Str); return; }
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = () => { resolve(base64Str); };
    });
};

export const compressRecommendationResult = async (result: RecommendationResult): Promise<RecommendationResult> => {
    const compressed = { ...result };
    if (compressed.outfit.image.startsWith('data:image')) compressed.outfit.image = await compressImage(compressed.outfit.image);
    if (compressed.recipe.image.startsWith('data:image')) compressed.recipe.image = await compressImage(compressed.recipe.image);
    return compressed;
};

const cleanJsonString = (str: string): string => {
    return str.replace(/```json/g, '').replace(/```/g, '').trim();
};

const getBodyVisualDescriptor = (boneStructure: BoneStructure): string => {
    switch (boneStructure) {
        case BoneStructure.Ectomorph: return "slim, slender, tall fashion model physique, elegant posture";
        case BoneStructure.Endomorph: return "curvy, voluptuous, confident plus-size fashion model, flattering silhouette, body positive";
        case BoneStructure.Mesomorph: return "athletic, toned, fit muscular physique, strong posture";
        default: return "balanced, natural healthy body type, relatable fashion look";
    }
};

// --- CORE GENERATION FUNCTIONS ---

/**
 * Routes the image generation request based on the provider.
 */
export const generateImage = async (prompt: string, aspectRatio: string = "1:1", provider: AIProvider = AIProvider.Gemini): Promise<string | null> => {
    if (provider === AIProvider.OpenAI) {
        return generateImageOpenAI(prompt, aspectRatio);
    } else {
        return generateImageGemini(prompt, aspectRatio);
    }
};

// [EXTERNAL] OpenAI Image Generation (Uses .env KEY)
const generateImageOpenAI = async (prompt: string, aspectRatio: string): Promise<string | null> => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.warn("OpenAI API Key missing in .env");
        return null;
    }
    
    const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

    try {
        // Resolution Logic for 'gpt-image-1-mini'
        // User requested: Outfit (2:3) -> 1024x1536, Food (1:1) -> 1024x1024
        let size = "1024x1024"; 

        if (aspectRatio === "2:3" || aspectRatio === "3:4") {
            size = "1024x1536"; // Vertical
        } else if (aspectRatio === "16:9") {
            size = "1536x1024" as any; // Landscape
        }

        const response = await openai.images.generate({
            model: "gpt-image-1-mini", 
            prompt: prompt,
            n: 1,
            size: size as any, 
            response_format: "b64_json",
            quality: "medium" as any 
        });
        return response.data[0].b64_json ? `data:image/png;base64,${response.data[0].b64_json}` : null;
    } catch (e) { 
        console.warn("OpenAI Image Gen Failed", e); 
        return null; 
    }
};

// [INTERNAL] Gemini Image Generation (Uses Native Environment KEY)
const generateImageGemini = async (prompt: string, aspectRatio: string): Promise<string | null> => {
    // Internal Native: AA.md pattern (Google AI Studio / IDX default)
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // SAFETY: Gemini supports "3:4" but NOT "2:3". Map it.
    let validAspectRatio = aspectRatio;
    if (aspectRatio === "2:3") validAspectRatio = "3:4";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig: { aspectRatio: validAspectRatio } }
        });
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (e) { console.warn("Gemini Image Gen Failed", e); return null; }
};

/**
 * Routes the Fridge Recipe request.
 */
export const generateFridgeRecipe = async (ingredients: string, user: UserProfile): Promise<Recipe | null> => {
    const provider = user.aiProvider || AIProvider.Gemini;
    const languageName = user.language === Language.KO ? 'Korean' : 'English';
    
    const systemInstruction = `You are a creative chef. Return JSON only.`;
    const prompt = `
        User Ingredients: ${ingredients}. User Preferences: ${user.tastes?.join(', ')}.
        Goal: Create a healthy recipe using provided ingredients. Language: ${languageName}.
        Output JSON: { "title": "string", "calories": number, "protein": "string", "time": "string", "badge": "string", "ingredients": [{"name": "string", "amount": "string"}], "steps": ["string"] }
    `;

    try {
        let data;
        
        if (provider === AIProvider.OpenAI) {
            // [EXTERNAL] OpenAI
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) throw new Error("Missing OpenAI Key");
            const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
            
            const completion = await openai.chat.completions.create({
                model: OPENAI_MODEL_GENERAL,
                messages: [{ role: "system", content: systemInstruction }, { role: "user", content: prompt }],
                response_format: { type: "json_object" }
            });
            data = JSON.parse(completion.choices[0].message.content || "{}");

        } else {
            // [INTERNAL] Gemini
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            data = JSON.parse(cleanJsonString(response.text || "{}"));
        }

        // Safe Guard for Ingredients & Steps
        const safeIngredients = Array.isArray(data.ingredients) ? data.ingredients : [];
        const safeSteps = Array.isArray(data.steps) ? data.steps : ["Mix ingredients.", "Cook thoroughly.", "Serve."];
        const safeTitle = data.title || "Delicious Meal";

        const imagePrompt = `Professional food photography, overhead shot of ${safeTitle}. Ingredients: ${safeIngredients.slice(0,3).map((i:any)=>i.name || 'food').join(', ')}. Studio lighting, 4k.`;
        const image = await generateImage(imagePrompt, "1:1", provider);

        return {
            ...data, 
            id: `ai-fridge-${Date.now()}`, 
            tags: ['AI_FRIDGE'],
            image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1024',
            ingredients: safeIngredients.map((i: any) => ({ ...i, image: '' })),
            steps: safeSteps
        };
    } catch (e) {
        console.error("Fridge Recipe Gen Failed:", e);
        return null;
    }
};

/**
 * Main Recommendation Engine
 */
export const fetchAIRecommendations = async (user: UserProfile): Promise<RecommendationResult | null> => {
    const provider = user.aiProvider || AIProvider.Gemini;
    const languageName = user.language === Language.KO ? 'Korean' : 'English';
    const genderTerm = user.gender === Gender.Female ? "Woman" : "Man";

    const systemInstruction = `You are a hyper-personalized lifestyle coach. Output valid JSON only.`;
    const contextPrompt = `Profile: ${user.gender}, ${user.mbti}, ${user.currentMood}, ${user.currentSeason}, ${user.boneStructure} body, Target: ${user.targetArea}. Language: ${languageName}.`;
    
    // 1. General Prompt
    const promptGeneral = `
        ${contextPrompt}
        Task: Generate Quote, Recipe, and Workout.
        Reqs: Recipe matching tastes, Workout for ${user.targetArea}.
        Output JSON:
        {
          "quote": { "text": "string", "author": "string" },
          "recipe": { "title": "string", "calories": number, "protein": "string", "time": "string", "badge": "string", "ingredients": [{"name": "string", "amount": "string"}], "steps": ["string"] },
          "workout": { "title": "string", "duration": "string", "intensity": "Low"|"Med"|"High", "exercises": [{"name": "string", "reps": "string", "description": "string"}] }
        }
    `;

    // 2. Style Prompt
    const promptStyle = `
        ${contextPrompt}
        Task: Generate specialized Fashion Outfit Advice.
        Reqs: Detailed styling advice explaining WHY it works for '${user.boneStructure}' and '${user.targetArea}'.
        Output JSON:
        {
          "outfit": { "title": "string", "description": "string", "proTip": "string", "hashtags": ["string"], "items": [{"name": "string", "type": "string"}] }
        }
    `;

    try {
        console.log(`Requesting Text Gen via ${provider}...`);
        let data: any = {};

        if (provider === AIProvider.OpenAI) {
            // [EXTERNAL] OpenAI Logic
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) throw new Error("Missing OpenAI Key");
            const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

            console.log(`[OpenAI] General with ${OPENAI_MODEL_GENERAL}, Style with ${OPENAI_MODEL_STYLE}`);
            
            const generalPromise = openai.chat.completions.create({
                model: OPENAI_MODEL_GENERAL,
                messages: [{ role: "system", content: systemInstruction }, { role: "user", content: promptGeneral }],
                response_format: { type: "json_object" }
            });

            const stylePromise = openai.chat.completions.create({
                model: OPENAI_MODEL_STYLE, 
                messages: [{ role: "system", content: systemInstruction }, { role: "user", content: promptStyle }],
                response_format: { type: "json_object" }
            });

            const [generalRes, styleRes] = await Promise.all([generalPromise, stylePromise]);
            const generalData = JSON.parse(generalRes.choices[0].message.content || "{}");
            const styleData = JSON.parse(styleRes.choices[0].message.content || "{}");
            data = { ...generalData, ...styleData };

        } else {
            // [INTERNAL] Gemini Logic (Native)
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // FIX: Replaced the placeholder "..." with a FULL explicit JSON schema.
            // This ensures Gemini knows exactly what structure to generate.
            const combinedPrompt = `
                ${contextPrompt}
                Task: Generate a complete lifestyle recommendation set including Quote, Recipe, Outfit, and Workout.
                
                JSON Schema:
                {
                  "quote": { "text": "string", "author": "string" },
                  "recipe": { 
                    "title": "string", "calories": number, "protein": "string", "time": "string", "badge": "string", 
                    "ingredients": [{"name": "string", "amount": "string"}], 
                    "steps": ["string"] 
                  },
                  "outfit": { 
                    "title": "string", "description": "string", "proTip": "string", 
                    "hashtags": ["string"], 
                    "items": [{"name": "string", "type": "string"}] 
                  },
                  "workout": { 
                    "title": "string", "duration": "string", "intensity": "Low"|"Med"|"High", 
                    "exercises": [{"name": "string", "reps": "string", "description": "string"}] 
                  }
                }
            `;
            
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: combinedPrompt,
                config: { responseMimeType: "application/json" }
            });
            data = JSON.parse(cleanJsonString(response.text || "{}"));
        }

        console.log("Text Success. Generating Images...");
        
        // --- CRITICAL SAFE DATA EXTRACTION ---
        // Prevents app crash when AI returns incomplete JSON arrays
        const outfitItems = Array.isArray(data?.outfit?.items) ? data.outfit.items : [];
        const outfitHashtags = Array.isArray(data?.outfit?.hashtags) ? data.outfit.hashtags : ["#OOTD", `#${user.currentSeason}`];
        
        const recipeIngredients = Array.isArray(data?.recipe?.ingredients) ? data.recipe.ingredients : [];
        const recipeSteps = Array.isArray(data?.recipe?.steps) ? data.recipe.steps : ["Prepare ingredients.", "Cook.", "Enjoy."];
        
        const outfitTitle = data?.outfit?.title || "Stylish Outfit";
        const recipeTitle = data?.recipe?.title || "Healthy Meal";

        const bodyDescriptor = getBodyVisualDescriptor(user.boneStructure);
        
        // Use SAFE variables in prompts
        const outfitPrompt = `Fashion photography, full body shot of a ${genderTerm} model with ${bodyDescriptor} wearing ${outfitTitle}. Items: ${outfitItems.map((i: any) => i.name || 'clothes').join(', ')}. Season: ${user.currentSeason}. Natural lighting, high fashion editorial, clean background.`;
        
        // Use 2:3 ratio for outfits (OpenAI 1024x1536 / Gemini 3:4)
        const outfitImage = await generateImage(outfitPrompt, "2:3", provider);

        if (provider === AIProvider.Gemini) await new Promise(resolve => setTimeout(resolve, 1000));

        const recipePrompt = `Professional food photography, overhead shot of ${recipeTitle}. Ingredients: ${recipeIngredients.slice(0,3).map((i: any) => i.name || 'food').join(', ')}. Studio lighting, appetizing, high detail.`;
        // Use 1:1 ratio for food
        const recipeImage = await generateImage(recipePrompt, "1:1", provider);

        return {
            quote: data.quote || { text: "Stay positive!", author: "Luvit AI" },
            recipe: {
                ...(data.recipe || {}),
                title: recipeTitle,
                id: `ai-recipe-${Date.now()}`,
                tags: [user.currentMood, user.currentSeason],
                image: recipeImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1024', 
                ingredients: recipeIngredients.map((i: any) => ({ ...i, image: '' })),
                steps: recipeSteps
            },
            outfit: {
                ...(data.outfit || {}),
                title: outfitTitle,
                id: `ai-outfit-${Date.now()}`,
                tags: [user.currentSeason, user.targetArea],
                image: outfitImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1024',
                items: outfitItems,
                hashtags: outfitHashtags
            },
            workout: {
                ...(data.workout || {}),
                id: `ai-workout-${Date.now()}`,
                tags: [user.targetArea],
                exercises: (data.workout?.exercises || []).map((ex: any) => ({
                    ...ex,
                    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1024' 
                }))
            }
        };

    } catch (error) {
        console.error(`${provider} API Error:`, error);
        return null;
    }
};