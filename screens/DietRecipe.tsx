import React, { useState } from 'react';
import { Recipe, UserProfile } from '../types';
import { t } from '../i18n';

interface Props {
  recipe: Recipe | undefined;
  user: UserProfile;
  onGenerateRecipe?: (ingredients: string) => void;
  isLoading?: boolean;
}

const DietRecipe: React.FC<Props> = ({ recipe, user, onGenerateRecipe, isLoading }) => {
  const [showFridgeModal, setShowFridgeModal] = useState(false);
  const [ingredientsInput, setIngredientsInput] = useState("");

  const handleCreate = () => {
    if (ingredientsInput.trim() && onGenerateRecipe) {
        onGenerateRecipe(ingredientsInput);
        setShowFridgeModal(false);
        setIngredientsInput("");
    }
  };

  if (!recipe) return <div className="p-10 text-center animate-pulse">Loading Recipe...</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-24 animate-fade-in relative">
      {/* Hero Image */}
      <div className="relative h-[420px] w-full">
         {/* Loading Overlay for Recipe Only */}
        {isLoading && (
            <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                <span className="material-symbols-rounded text-5xl animate-spin mb-3">outdoor_grill</span>
                <span className="font-bold">Cooking up a new recipe...</span>
            </div>
        )}
        <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
        
        {/* Title Overlay */}
        <div className="absolute bottom-10 left-6 right-6 text-white">
          <h1 className="text-3xl font-bold leading-tight mb-4 font-display">{recipe.title}</h1>
          <div className="bg-white/10 backdrop-blur-md rounded-full p-1 inline-flex items-center border border-white/20">
            <span className="px-5 py-2 bg-primary text-white rounded-full text-sm font-semibold shadow-md">
                {user.currentSeason}
            </span>
          </div>
        </div>
      </div>

      {/* Content Sheet */}
      <div className="relative z-10 -mt-8 bg-background-light dark:bg-background-dark rounded-t-[2.5rem] px-6 pt-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        {/* Handle Bar */}
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-8"></div>

        {/* Macros */}
        <div className="flex justify-between items-center gap-2 mb-10 px-2">
            <div className="text-center flex-1">
                <span className="block text-2xl font-bold text-gray-900 dark:text-white">{recipe.calories}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{t(user.language, 'kcal')}</span>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
            <div className="text-center flex-1">
                <span className="block text-2xl font-bold text-gray-900 dark:text-white">{recipe.protein}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{t(user.language, 'protein')}</span>
            </div>
            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
             <div className="text-center flex-1">
                <span className="block text-xl font-bold text-primary mb-1">{recipe.badge || 'Match'}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{t(user.language, 'focus')}</span>
            </div>
        </div>

        {/* Ingredients */}
        <div className="mb-10">
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t(user.language, 'ingredients')}</h2>
                <span className="text-primary text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full">{t(user.language, 'servings')}</span>
            </div>
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-6 px-6 no-scrollbar">
                {recipe.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex-shrink-0 w-24 flex flex-col items-center group">
                        <div className="w-16 h-16 rounded-full bg-white dark:bg-white/5 p-1 shadow-sm mb-3 border-2 border-transparent group-hover:border-primary transition-colors overflow-hidden relative">
                             {ing.image ? (
                                 <img src={ing.image} className="w-full h-full object-cover rounded-full" alt={ing.name}/>
                             ) : (
                                 <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold rounded-full">{ing.name[0]}</div>
                             )}
                        </div>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 text-center">{ing.name}</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wide mt-0.5">{ing.amount}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* AI Fridge Feature Banner - NOW ALWAYS VISIBLE */}
        <div className="mb-12">
            <button 
                onClick={() => setShowFridgeModal(true)}
                className="w-full group relative overflow-hidden rounded-2xl bg-white dark:bg-white/5 border border-primary/20 shadow-sm hover:shadow-md transition-all text-left"
            >
                <div className="p-1">
                    <div className="relative flex items-center justify-between p-4 bg-primary/5 rounded-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">center_focus_strong</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{t(user.language, 'missing_ingredients')}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t(user.language, 'scan_fridge')}</p>
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <span className="material-symbols-rounded text-lg">arrow_forward</span>
                        </div>
                    </div>
                </div>
            </button>
        </div>

        {/* Preparation Steps */}
        <div className="pb-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">{t(user.language, 'preparation')}</h2>
            <div className="space-y-10 relative pl-2">
                <div className="absolute left-[15px] top-4 bottom-10 w-[2px] bg-gray-100 dark:bg-gray-800"></div>
                {recipe.steps.map((step, idx) => (
                    <div key={idx} className="relative flex gap-6 group">
                        <div className="z-10 flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shadow-lg ring-4 ring-background-light dark:ring-background-dark">
                            {idx + 1}
                        </div>
                        <div className="pt-1">
                            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">{t(user.language, 'step')} {idx + 1}</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                                {step}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Fridge Input Modal */}
      {showFridgeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFridgeModal(false)}></div>
              <div className="bg-white dark:bg-background-dark w-full max-w-sm rounded-2xl p-6 relative z-10 shadow-2xl border border-white/10 animate-fade-in-up">
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t(user.language, 'fridge_modal_title')}</h3>
                  <textarea 
                    value={ingredientsInput}
                    onChange={(e) => setIngredientsInput(e.target.value)}
                    placeholder={t(user.language, 'fridge_placeholder')}
                    className="w-full h-32 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-4 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  />
                  <div className="flex gap-3">
                      <button 
                        onClick={() => setShowFridgeModal(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      >
                          {t(user.language, 'cancel_button')}
                      </button>
                      <button 
                        onClick={handleCreate}
                        disabled={!ingredientsInput.trim()}
                        className="flex-1 py-3 rounded-xl font-bold bg-primary text-white shadow-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                      >
                          {t(user.language, 'cook_button')}
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default DietRecipe;