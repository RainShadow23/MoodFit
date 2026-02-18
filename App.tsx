import React, { useState, useEffect } from 'react';
import { UserProfile, Mood, Season, MBTI, BodyTarget, RecommendationResult, Gender, BoneStructure, Language, AIProvider } from './types';
import { getRecommendations } from './services/engine';
import BottomNav from './components/BottomNav';
import Dashboard from './screens/Dashboard';
import DietRecipe from './screens/DietRecipe';
import StyleWorkout from './screens/StyleWorkout';
import ProfileSetup from './screens/ProfileSetup';
import { t } from './i18n';
import { fetchAIRecommendations, compressRecommendationResult, generateFridgeRecipe } from './services/geminiService';

const LATEST_AI_KEY = 'luvitt_latest_ai_data';

const App: React.FC = () => {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'style' | 'diet'>('home');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // User Context State
  const [user, setUser] = useState<UserProfile>({
    name: "Sarah",
    mbti: MBTI.ENFP,
    currentMood: Mood.Happy,
    currentSeason: Season.Autumn,
    targetArea: BodyTarget.Waist,
    useAI: true, 
    aiProvider: AIProvider.Gemini, // Changed from OpenAI to Gemini for stability
    gender: Gender.Female,
    boneStructure: BoneStructure.Ectomorph,
    language: Language.EN, 
    height: 165,
    weight: 55,
    tastes: []
  });

  // Data State
  const [data, setData] = useState<RecommendationResult | null>(null);

  // Initial Load - Only runs ONCE on mount
  useEffect(() => {
    initializeData();
  }, []); 

  // Watch for AI Toggle: If turned OFF, revert to local mock immediately.
  useEffect(() => {
      if (!user.useAI) {
          loadLocalData();
      } 
      // Note: If turned ON, we do NOTHING automatically. 
      // We keep showing the current data (whether local or cached).
      // The user must explicitly click "Refresh" to trigger an AI call.
  }, [user.useAI]);


  const initializeData = () => {
      // Priority 1: Check LocalStorage (Persisted AI Data)
      const cached = localStorage.getItem(LATEST_AI_KEY);
      
      if (cached) {
          try {
              const parsedData = JSON.parse(cached);
              console.log("Restored latest AI session from storage");
              setData(parsedData);
              return; // Exit if cache found
          } catch (e) {
              console.error("Cache corrupted, clearing and loading local");
              localStorage.removeItem(LATEST_AI_KEY);
          }
      } 
      
      // Priority 2: Load Local Mock Data (Free, Instant)
      console.log("No cache found. Loading local mock data.");
      loadLocalData();
  };

  const loadLocalData = async () => {
      // getRecommendations is now purely local (engine.ts was updated)
      const result = await getRecommendations(user);
      setData(result);
  };

  const handleRefresh = async () => {
      // 1. If AI is explicitly OFF, just shuffle local data
      if (!user.useAI) {
          await loadLocalData();
          return;
      }

      // 2. If AI is ON, Trigger Generation (This is the ONLY place API is called for main recommendations)
      setIsLoading(true);
      try {
          const aiResult = await fetchAIRecommendations(user);
          
          if (aiResult) {
              // A. Update UI with High Quality Images IMMEDIATELY (RAM)
              setData(aiResult);

              // B. Background Process: Compress & Save to Storage (Disk)
              compressRecommendationResult(aiResult).then(compressedData => {
                  try {
                    localStorage.setItem(LATEST_AI_KEY, JSON.stringify(compressedData));
                    console.log("Saved compressed version to storage");
                  } catch (storageError) {
                    console.error("LocalStorage Full or Error:", storageError);
                    alert("Storage full. Data shown but won't persist reload.");
                  }
              });

          } else {
              alert("AI Generation failed. Falling back to local data.");
              // Fallback to local if API fails/quota exceeded
              loadLocalData(); 
          }
      } catch (e) {
          console.error("Refresh failed", e);
          alert("Connection error. Using local data.");
          loadLocalData();
      } finally {
          setIsLoading(false);
      }
  };

  const handleFridgeRecipe = async (ingredients: string) => {
      if (!data) return;
      setIsLoading(true);
      try {
          const newRecipe = await generateFridgeRecipe(ingredients, user);
          if (newRecipe) {
              // Merge new recipe into existing data
              const newData = { ...data, recipe: newRecipe };
              
              // A. Update UI
              setData(newData);

              // B. Persist (Compress entire object again)
              compressRecommendationResult(newData).then(compressedData => {
                 localStorage.setItem(LATEST_AI_KEY, JSON.stringify(compressedData));
              });
          } else {
              alert("Could not generate recipe. Please try different ingredients or check API Key.");
          }
      } catch (e) {
          console.error("Fridge gen error", e);
          alert("Error generating recipe.");
      } finally {
          setIsLoading(false);
      }
  };

  const handleMoodChange = (mood: Mood) => {
    setUser(prev => ({ ...prev, currentMood: mood }));
  };

  const handleSeasonChange = (season: Season) => {
    setUser(prev => ({ ...prev, currentSeason: season }));
  };

  const handleProfileUpdate = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="w-full min-h-screen bg-background-light dark:bg-background-dark relative overflow-x-hidden">
      
      {/* Global Header - ONLY visible on Home Tab to prevent double whitespace on others */}
      {currentTab === 'home' && (
        <header className="max-w-7xl mx-auto px-6 pt-12 pb-4 flex justify-between items-center sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm transition-all duration-300">
           <div className="flex items-center gap-4">
            <div className="relative">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOiIxIif4rUdLl3Qb9rzfT9kR0uZB42TAt0F5SGWXzuoB7wE9-FudS1vZr6Ydcaf9QwUAmlYzIaDhqd7jXvOmxwCaJePC5rN7rbFF4j2VZN3mJjkA5YUiaNXCduPPrN9eqgoPen2boIQLYhCYZbplS8knY5RDvaXw80lXBquR-lY6ttr5SZdRhlyH1JgYmfHCxfjZF9-ecEsTTNJRRcGTRmMpLxAiBAMYhbnGGYY3StX33sB2Zhxitz7cn0uglcGIhIlkpwPqFqDI" alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{t(user.language, 'good_morning')}</p>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            </div>
           </div>
           
           <button 
                onClick={() => setShowProfileModal(true)}
                className="w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-300 transition-transform active:scale-95"
            >
                <span className="material-icons-round">person_outline</span>
            </button>
        </header>
      )}

      {/* Main Content Area */}
      <main className="w-full">
        {currentTab === 'home' && (
            <Dashboard 
                user={user} 
                data={data} 
                onMoodChange={handleMoodChange}
                onNavigate={setCurrentTab} 
                onOpenProfile={() => setShowProfileModal(true)}
            />
        )}
        {currentTab === 'diet' && (
             <DietRecipe 
                recipe={data?.recipe} 
                user={user} 
                onGenerateRecipe={handleFridgeRecipe}
                isLoading={isLoading}
             />
        )}
        {currentTab === 'style' && (
            <StyleWorkout 
                outfit={data?.outfit} 
                workout={data?.workout} 
                recipe={data?.recipe}
                quote={data?.quote}
                user={user} 
                onSeasonChange={handleSeasonChange}
                onOpenProfile={() => setShowProfileModal(true)}
                onRefresh={handleRefresh}
                isLoading={isLoading}
            />
        )}
      </main>

      {/* Overlays */}
      {showProfileModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
              <ProfileSetup 
                user={user} 
                onUpdate={handleProfileUpdate} 
                onClose={() => setShowProfileModal(false)} 
              />
          </div>
      )}

      {/* Navigation */}
      <BottomNav 
        activeTab={currentTab} 
        onTabChange={setCurrentTab} 
        onOpenProfile={() => setShowProfileModal(true)}
        user={user}
      />

    </div>
  );
};

export default App;