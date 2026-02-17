export enum Mood {
  Happy = 'Happy',
  Calm = 'Calm',
  Tired = 'Tired',
  Anxious = 'Anxious',
  Energetic = 'Energetic'
}

export enum Season {
  Spring = 'Spring',
  Summer = 'Summer',
  Autumn = 'Autumn',
  Winter = 'Winter'
}

export enum MBTI {
  ENFP = 'ENFP',
  INTJ = 'INTJ',
  ESFJ = 'ESFJ',
  INTP = 'INTP',
  ISFP = 'ISFP',
  INFJ = 'INFJ',
  ISTP = 'ISTP',
  ISTJ = 'ISTJ',
  ENTP = 'ENTP',
  ENFJ = 'ENFJ',
  ESTP = 'ESTP',
  ESTJ = 'ESTJ',
  ISFJ = 'ISFJ',
  ESFP = 'ESFP',
  ENTJ = 'ENTJ',
  INFP = 'INFP',
  OTHER = 'OTHER'
}

export enum BodyTarget {
  Waist = 'Waist', // Maps to Belly/Core
  Legs = 'Legs',   // Maps to Thighs/Lower Body
  Arms = 'Arms',
  FullBody = 'Full Body'
}

export enum Gender {
  Female = 'Female',
  Male = 'Male'
}

export enum BoneStructure {
  Ectomorph = 'Ectomorph', // Slim
  Mesomorph = 'Mesomorph', // Athletic
  Endomorph = 'Endomorph', // Soft/Curvy
  Normal = 'Normal'        // Balanced/Average
}

export enum Language {
  EN = 'en',
  KO = 'ko'
}

export enum AIProvider {
  Gemini = 'Gemini',
  OpenAI = 'OpenAI'
}

export interface UserProfile {
  name: string;
  mbti: MBTI;
  currentMood: Mood;
  currentSeason: Season;
  targetArea: BodyTarget;
  useAI: boolean; 
  aiProvider: AIProvider; // New Field
  gender: Gender;
  boneStructure: BoneStructure;
  language: Language;
  
  // New Fields
  height: number; // cm
  weight: number; // kg
  tastes: string[]; // e.g., 'Spicy', 'Vegan'
}

export interface TaggedItem {
  id: string;
  tags: string[]; 
}

export interface Ingredient {
  name: string;
  amount: string;
  image?: string;
  origin?: string;
  benefits?: string;
}

export interface Recipe extends TaggedItem {
  title: string;
  calories: number;
  protein: string;
  time: string;
  image: string;
  ingredients: Ingredient[];
  steps: string[];
  matchScore?: number; 
  badge?: string; 
}

export interface OutfitItem {
  name: string;
  type: string;
}

export interface Outfit extends TaggedItem {
  title: string;
  description: string;
  image: string;
  proTip: string;
  hashtags: string[];
  items?: OutfitItem[];
}

export interface Workout extends TaggedItem {
  title: string;
  duration: string;
  intensity: 'Low' | 'Med' | 'High';
  exercises: {
    name: string;
    reps: string;
    description: string;
    image: string;
  }[];
}

export interface RecommendationResult {
  quote: {
    text: string;
    author: string;
  };
  recipe: Recipe;
  outfit: Outfit;
  workout: Workout;
}