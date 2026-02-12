import { UserProfile, RecommendationResult, TaggedItem, Language } from '../types';
import { getMockData } from '../constants';
import { fetchAIRecommendations } from './geminiService';

// Helper to score local items
const scoreItem = (item: TaggedItem, user: UserProfile): number => {
  let score = 0;
  if (item.tags.includes(user.currentMood)) score += 3;
  if (item.tags.includes(user.currentSeason)) score += 2;
  if (item.tags.includes(user.mbti)) score += 1;
  if (item.tags.includes(user.targetArea)) score += 4; // High weight for target area in workout/style
  return score;
};

const getBestMatch = <T extends TaggedItem>(items: T[], user: UserProfile): T => {
  const sorted = [...items].sort((a, b) => scoreItem(b, user) - scoreItem(a, user));
  
  // Pick randomly from the top 2 items to ensure "Refresh" button provides variety
  const topCandidates = sorted.slice(0, 2);
  if (topCandidates.length > 0) {
      const randomIndex = Math.floor(Math.random() * topCandidates.length);
      return topCandidates[randomIndex];
  }
  
  return sorted[0];
};

export const getRecommendations = async (user: UserProfile): Promise<RecommendationResult> => {
  // 1. Try AI if enabled
  if (user.useAI) {
    const aiResult = await fetchAIRecommendations(user);
    if (aiResult) return aiResult;
    // Fallback to local if AI fails
  }

  // 2. Local Engine Logic
  const { recipes, outfits, workouts } = getMockData(user.language);

  const bestRecipe = getBestMatch(recipes, user);
  const bestOutfit = getBestMatch(outfits, user);
  const bestWorkout = getBestMatch(workouts, user);

  // Simple local quote logic (Localized)
  const quotes: Record<Language, Record<string, string>> = {
      [Language.EN]: {
        'ENFP': "Creativity is intelligence having fun.",
        'INTJ': "Efficiency is the soul of success.",
        'Happy': "Keep your face always toward the sunshine.",
        'default': "Your only limit is your mind."
      },
      [Language.KO]: {
        'ENFP': "창의성은 지능이 즐거워하는 것입니다.",
        'INTJ': "효율성은 성공의 영혼입니다.",
        'Happy': "항상 햇살을 향해 얼굴을 드세요.",
        'default': "당신의 유일한 한계는 당신의 마음뿐입니다."
      }
  };
  
  const quoteText = quotes[user.language][user.mbti] || quotes[user.language][user.currentMood] || quotes[user.language]['default'];

  return {
    quote: {
      text: quoteText,
      author: "Fit & Mood Guide"
    },
    recipe: bestRecipe,
    outfit: bestOutfit,
    workout: bestWorkout
  };
};