// import OpenAI from "openai"; // REMOVED
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, RecommendationResult, Language, Recipe, BoneStructure, Gender, AIProvider } from "../types";

// --- Global Constants (Injected via Vite or Hardcoded) ---
declare const __GOOGLE_KEY__: string;
// declare const __OPENAI_KEY__: string; // REMOVED

// --- Key Retrieval (환경변수에서만 읽음 - 하드코딩 금지) ---
const sanitizeKey = (key: string): string => key.replace(/[^\x20-\x7E]/g, '').trim();
const GOOGLE_API_KEY: string = sanitizeKey((typeof __GOOGLE_KEY__ !== 'undefined' && __GOOGLE_KEY__) ? __GOOGLE_KEY__ : "");
// const OPENAI_API_KEY: string = ... // REMOVED (Client-side key redundant)


console.log("[GeminiService] Config Status:", {
    OpenAI: "✅ Proxy Ready",
    Google: GOOGLE_API_KEY ? "✅ Ready (Built-in)" : "❌ Missing"
});

// --- Model Configuration ---
const OPENAI_MODEL_GENERAL = "gpt-4o-mini";
const OPENAI_MODEL_STYLE = "gpt-4o";

// --- Helper: Safely Normalize Ingredients ---
const normalizeIngredients = (ingredients: any[]): any[] => {
    if (!Array.isArray(ingredients) || ingredients.length === 0) {
        return [
            { name: "Main Ingredient", amount: "1 serving", image: "" },
            { name: "Fresh Veggies", amount: "1 cup", image: "" },
            { name: "Signature Sauce", amount: "2 tbsp", image: "" }
        ];
    }
    return ingredients.map(i => {
        if (typeof i === 'string') return { name: i, amount: '', image: '' };
        return {
            name: i.name || 'Ingredient',
            amount: i.amount || '',
            image: ''
        };
    });
};

// --- Helper: Safely Normalize Outfit Items ---
const normalizeOutfitItems = (items: any[]): any[] => {
    // If AI returns empty array, provide generic fallbacks so UI isn't empty
    if (!Array.isArray(items) || items.length === 0) {
        return [
            { name: "Statement Top", type: "Top" },
            { name: "Tailored Bottoms", type: "Pants" },
            { name: "Comfort Shoes", type: "Footwear" },
            { name: "Minimalist Bag", type: "Accessory" }
        ];
    }
    return items.map(i => ({
        name: i.name || "Item",
        type: i.type || "Clothing"
    }));
};

// --- Image Utils ---
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
        case BoneStructure.Ectomorph: return "slim, slender, lean body type, long limbs, narrow shoulders, elegant posture, tall fashion model physique";
        case BoneStructure.Endomorph: return "curvy, full-figured, plus-size body, rounder silhouette, soft curves, body-positive fashion model, wider hips and shoulders";
        case BoneStructure.Mesomorph: return "athletic, muscular, broad shoulders, defined physique, toned body, strong posture, fit sports model";
        default: return "average build, natural healthy body type, balanced proportions";
    }
};

// --- CORE GENERATION FUNCTIONS ---

export const generateImage = async (prompt: string, aspectRatio: string = "1:1", provider: AIProvider = AIProvider.Gemini): Promise<string | null> => {
    if (provider === AIProvider.OpenAI) {
        return generateImageOpenAI(prompt, aspectRatio);
    } else {
        return generateImageGemini(prompt, aspectRatio);
    }
};

// [EXTERNAL] OpenAI Image Generation (via Cloudflare Proxy)
const generateImageOpenAI = async (prompt: string, aspectRatio: string): Promise<string | null> => {
    // [MODEL SPEC]: gpt-image-1-mini
    const modelName = "gpt-image-1-mini";

    try {
        let size: "1024x1024" | "1024x1536" | "1536x1024" = "1024x1024";

        if (aspectRatio === "3:4" || aspectRatio === "9:16") {
            size = "1024x1536"; // Portrait
        } else if (aspectRatio === "16:9") {
            size = "1536x1024"; // Landscape
        }

        console.log(`[OpenAI Proxy] Generating Image with ${modelName} (${size})...`);

        // Proxy Call
        const response = await fetch('/api/openai-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: modelName,
                prompt: prompt,
                n: 1,
                size: size,
                quality: "medium"
                // response_format 제거 (Foundry Spec: gpt-image-1-mini는 이를 지원하지 않거나 기본값 사용)
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[OpenAI Proxy] Image Gen Failed: ${response.status} ${response.statusText}`, errorText);
            // 에러가 400이면 파라미터 문제일 가능성 높음
            return null;
        }

        const data = await response.json();
        const item = data.data?.[0] as any;

        // 1. b64_json 확인
        if (item?.b64_json) {
            return `data:image/png;base64,${item.b64_json}`;
        }

        // 2. url 확인 (response_format 없을 시 기본값) -> 다운로드 및 변환 필요하지만 일단 URL 반환 시도 또는 null
        // CORS 문제로 프론트에서 직접 다운로드가 안될 수 있으므로, 가능하다면 URL이라도 반환
        if (item?.url) {
            return item.url;
            // 주의: OpenAI URL은 만료 시간이 있음. 바로 <img> 태그에 쓰거나, 프록시가 다운로드해서 줘야 함.
            // 현재 구조상 URL을 반환하면 <img src="...">로 작동은 할 것임.
        }

        console.warn("[OpenAI Proxy] No image data (b64_json or url) in response", data);
        return null;

    } catch (e: any) {
        console.warn(`[OpenAI Proxy] Image Gen Exception:`, e);
        return null;
    }
};

// [INTERNAL] Gemini Image Generation
const generateImageGemini = async (prompt: string, aspectRatio: string): Promise<string | null> => {
    if (!GOOGLE_API_KEY) {
        console.warn("Google API Key missing.");
        return null;
    }
    const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

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

export const generateFridgeRecipe = async (ingredients: string, user: UserProfile): Promise<Recipe | null> => {
    const provider = user.aiProvider || AIProvider.Gemini;
    const languageName = user.language === Language.KO ? 'Korean' : 'English';
    const languageInstruction = `IMPORTANT: Output JSON values in ${languageName} language.`;

    const systemInstruction = `You are a creative chef. Return JSON only. ${languageInstruction}`;
    const prompt = `
        User Ingredients: ${ingredients}. User Preferences: ${user.tastes?.join(', ')}.
        Goal: Create a healthy recipe. 
        Output JSON: { "title": "string", "calories": number, "protein": "string", "time": "15 min", "badge": "string", "ingredients": [{"name": "string", "amount": "string"}], "steps": ["string"] }
        ENSURE "time" field is present (e.g., "20 min").
    `;

    try {
        let data;

        if (provider === AIProvider.OpenAI) {
            // Proxy Call
            const response = await fetch('/api/openai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: OPENAI_MODEL_GENERAL,
                    messages: [{ role: "system", content: systemInstruction }, { role: "user", content: prompt }],
                    response_format: { type: "json_object" }
                })
            });

            if (!response.ok) throw new Error(`OpenAI Proxy Error: ${response.status}`);
            const result = await response.json();
            data = JSON.parse(result.choices?.[0]?.message?.content || "{}");
        } else {
            if (!GOOGLE_API_KEY) throw new Error("Missing Google API Key");
            const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: systemInstruction + "\n" + prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            calories: { type: Type.NUMBER },
                            protein: { type: Type.STRING },
                            time: { type: Type.STRING },
                            badge: { type: Type.STRING },
                            ingredients: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        amount: { type: Type.STRING }
                                    }
                                }
                            },
                            steps: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            }
                        }
                    }
                }
            });
            data = JSON.parse(cleanJsonString(response.text || "{}"));
        }

        const safeIngredients = normalizeIngredients(data?.ingredients);
        const safeSteps = Array.isArray(data?.steps) ? data.steps : ["Mix ingredients.", "Cook thoroughly.", "Serve."];
        const safeTitle = data?.title || "Delicious Meal";
        const safeTime = data?.time || "20 min";

        const imagePrompt = `Professional food photography, overhead shot of ${safeTitle}. Ingredients: ${safeIngredients.slice(0, 3).map((i: any) => i.name || 'food').join(', ')}. Studio lighting, 4k.`;
        const image = await generateImage(imagePrompt, "1:1", provider);

        return {
            ...data,
            id: `ai-fridge-${Date.now()}`,
            tags: ['AI_FRIDGE'],
            image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1024',
            ingredients: safeIngredients.map((i: any) => ({ ...i, image: '' })),
            steps: safeSteps,
            time: safeTime
        };
    } catch (e) {
        console.error("Fridge Recipe Gen Failed:", e);
        return null;
    }
};

export const fetchAIRecommendations = async (user: UserProfile): Promise<RecommendationResult | null> => {
    const provider = user.aiProvider || AIProvider.Gemini;
    const languageName = user.language === Language.KO ? 'Korean' : 'English';
    const genderTerm = user.gender === Gender.Female ? "Woman" : "Man";

    const languageInstruction = `CRITICAL: All text content (titles, descriptions, steps, advice) MUST be written in ${languageName}. Do not use English unless it is a proper noun.`;

    const systemInstruction = `You are a hyper-personalized lifestyle coach. Output valid JSON only. ${languageInstruction}`;

    // 체형별 스타일 가이드 (코디 다양성 강화)
    const getStyleGuide = (boneStructure: BoneStructure, gender: Gender): string => {
        const g = gender === Gender.Female ? "women" : "men";
        switch (boneStructure) {
            case BoneStructure.Ectomorph:
                return `Style guide for slim/lean ${g}: Use layering to add visual bulk. Prefer horizontal stripes, chunky knits, cargo pants, oversized silhouettes, puffer jackets, wide-leg trousers. Avoid overly tight or clingy fabrics.`;
            case BoneStructure.Endomorph:
                return `Style guide for full-figured/plus-size ${g}: Use vertical lines and monochromatic looks to elongate. Prefer A-line cuts, wrap styles, structured blazers, dark wash denim, flowy midi skirts, empire waist. Avoid overly baggy or shapeless pieces.`;
            case BoneStructure.Mesomorph:
                return `Style guide for athletic/muscular ${g}: Highlight the physique with well-fitted pieces. Prefer fitted tees, slim-cut chinos, athletic wear, bomber jackets, tailored suits, compression-style tops. Avoid overly boxy or shapeless cuts.`;
            default:
                return `Style guide for balanced body type ${g}: Most silhouettes work well. Experiment freely with proportions, mixing fitted and relaxed pieces.`;
        }
    };

    const styleGuide = getStyleGuide(user.boneStructure, user.gender);
    const randomSeed = Math.floor(Math.random() * 10000); // 매 요청마다 다른 결과 유도

    const contextPrompt = `
        Profile:
        - Gender: ${user.gender}
        - Body Type: ${user.boneStructure}
        - Height: ${user.height}cm, Weight: ${user.weight}kg
        - MBTI: ${user.mbti} (personality affects style preference)
        - Current Mood: ${user.currentMood}
        - Season: ${user.currentSeason}
        - Target Area: ${user.targetArea}
        - Taste Preferences: ${user.tastes?.join(', ')}
        - Variation seed: ${randomSeed}
    `;

    // --- PROMPT 1: LIFESTYLE (Quote, Recipe, Workout) ---
    const promptLifestyle = `
        ${contextPrompt}
        Task: Generate Quote, Recipe, and Workout (NO OUTFIT).
        
        Recipe Constraints:
        1. "time": MUST be a string like "15 min". DO NOT OMIT.
        2. "ingredients": Must have at least 4 items.
        
        Workout Constraints:
        1. 3 Specific exercises for '${user.targetArea}'.
    `;

    // --- PROMPT 2: STYLE (Outfit Only) ---
    const promptStyle = `
        ${contextPrompt}
        Task: Generate a UNIQUE and CREATIVE Fashion Outfit for ${user.currentSeason} season.
        
        IMPORTANT DIVERSITY RULES:
        - This must be a COMPLETELY DIFFERENT outfit style from generic recommendations.
        - The variation seed is ${randomSeed} — use this to generate a unique combination.
        - Do NOT suggest basic/generic outfits like "white t-shirt + jeans".
        - Be specific with colors, materials, and brands/styles (e.g., "Camel wool overcoat", "Burgundy corduroy trousers").
        
        Body Type Styling Guide:
        ${styleGuide}
        
        Outfit Constraints:
        1. "items": MUST be an array of at least 5 objects with specific item names (e.g., "Olive green cargo pants", not just "pants").
        2. DO NOT return a simple string description for items. It MUST be a JSON array.
        3. "description": Explain specifically WHY each piece works for a ${user.boneStructure} body type.
        4. "title": Must be a creative outfit name reflecting the season and body type (e.g., "Autumn Layered Streetwear for Athletic Build").
    `;

    try {
        console.log(`[Main] Requesting Text Gen via ${provider}...`);
        let data: any = {};

        // [STRATEGY] Use Parallel Requests for BOTH Providers to ensure depth.
        // This fixes Gemini "Lazy JSON" issues by splitting the cognitive load.

        if (provider === AIProvider.OpenAI) {
            // Proxy Calls (Parallel)

            // OpenAI still relies on prompt engineering for structure (or response_format json_object)
            const promptLifestyleWithJson = promptLifestyle + `\nOutput JSON: { "quote": { "text": "string", "author": "string" }, "recipe": { "title": "string", "calories": number, "protein": "string", "time": "15 min", "badge": "string", "ingredients": [{"name": "string", "amount": "string"}], "steps": ["string"] }, "workout": { "title": "string", "duration": "string", "intensity": "Low"|"Med"|"High", "exercises": [{"name": "string", "reps": "string", "description": "string"}] } }`;
            const promptStyleWithJson = promptStyle + `\nOutput JSON: { "outfit": { "title": "string", "description": "string", "proTip": "string", "hashtags": ["string"], "items": [{"name": "string", "type": "string"}] } }`;

            const lifestylePromise = fetch('/api/openai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: OPENAI_MODEL_GENERAL,
                    messages: [{ role: "system", content: systemInstruction }, { role: "user", content: promptLifestyleWithJson }],
                    response_format: { type: "json_object" }
                })
            }).then(r => r.json());

            const stylePromise = fetch('/api/openai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: OPENAI_MODEL_STYLE,
                    messages: [{ role: "system", content: systemInstruction }, { role: "user", content: promptStyleWithJson }],
                    response_format: { type: "json_object" }
                })
            }).then(r => r.json());

            const [lifestyleRes, styleRes] = await Promise.all([lifestylePromise, stylePromise]);

            data = {
                ...JSON.parse(lifestyleRes.choices?.[0]?.message?.content || "{}"),
                ...JSON.parse(styleRes.choices?.[0]?.message?.content || "{}")
            };

        } else {
            // [GEMINI SPLIT FIX] Use STRICT SCHEMA to prevent lazy/empty data
            if (!GOOGLE_API_KEY) throw new Error("Missing Google API Key");
            const ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });

            // Schema for Lifestyle (Recipe, Workout, Quote)
            const lifestylePromise = ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: systemInstruction + "\n" + promptLifestyle,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            quote: {
                                type: Type.OBJECT,
                                properties: {
                                    text: { type: Type.STRING },
                                    author: { type: Type.STRING }
                                }
                            },
                            recipe: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    calories: { type: Type.NUMBER },
                                    protein: { type: Type.STRING },
                                    time: { type: Type.STRING },
                                    badge: { type: Type.STRING },
                                    ingredients: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                name: { type: Type.STRING },
                                                amount: { type: Type.STRING }
                                            }
                                        }
                                    },
                                    steps: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    }
                                }
                            },
                            workout: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    duration: { type: Type.STRING },
                                    intensity: { type: Type.STRING, enum: ["Low", "Med", "High"] },
                                    exercises: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                name: { type: Type.STRING },
                                                reps: { type: Type.STRING },
                                                description: { type: Type.STRING }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            // Schema for Style (Outfit)
            const stylePromise = ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: systemInstruction + "\n" + promptStyle,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            outfit: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    proTip: { type: Type.STRING },
                                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    items: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                name: { type: Type.STRING },
                                                type: { type: Type.STRING }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            const [lifestyleRes, styleRes] = await Promise.all([lifestylePromise, stylePromise]);

            data = {
                ...JSON.parse(cleanJsonString(lifestyleRes.text || "{}")),
                ...JSON.parse(cleanJsonString(styleRes.text || "{}"))
            };
        }

        console.log("Text Gen Success (Schema Enforced). Starting Image Gen...");

        const outfitItems = normalizeOutfitItems(data?.outfit?.items);
        const outfitHashtags = Array.isArray(data?.outfit?.hashtags) ? data.outfit.hashtags : ["#OOTD", `#${user.currentSeason}`];

        const recipeIngredients = normalizeIngredients(data?.recipe?.ingredients);
        const recipeSteps = Array.isArray(data?.recipe?.steps) ? data.recipe.steps : ["Prepare.", "Cook.", "Enjoy."];
        const recipeTime = data?.recipe?.time || "20 min";

        const outfitTitle = data?.outfit?.title || "Stylish Outfit";
        const recipeTitle = data?.recipe?.title || "Healthy Meal";

        let outfitPrompt = "";

        {
            const bodyDescriptor = getBodyVisualDescriptor(user.boneStructure);
            outfitPrompt = `Fashion photography, full body shot of a ${genderTerm} with ${bodyDescriptor} wearing ${outfitTitle}. Outfit items: ${outfitItems.map((i: any) => i.name || 'clothes').join(', ')}. Season: ${user.currentSeason}. The body type must be clearly visible and realistic. Clean studio background, high quality editorial fashion photo, full body visible from head to toe.`;
        }

        const [outfitImage, recipeImage] = await Promise.all([
            generateImage(outfitPrompt, "3:4", provider),
            (async () => {
                if (provider === AIProvider.Gemini) await new Promise(r => setTimeout(r, 1000));
                const recipePrompt = `Professional food photography, overhead shot of ${recipeTitle}. Ingredients: ${recipeIngredients.slice(0, 3).map((i: any) => i.name || 'food').join(', ')}. Studio lighting, appetizing, high detail.`;
                return generateImage(recipePrompt, "1:1", provider);
            })()
        ]);

        return {
            quote: data.quote || { text: "Stay positive!", author: "Luvit AI" },
            recipe: {
                ...(data.recipe || {}),
                title: recipeTitle,
                time: recipeTime,
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