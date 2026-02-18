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

  const renderIngredients = (isDesktop: boolean) => (
    <div className={isDesktop ? "hidden lg:block" : "block lg:hidden"}>
        <div className="flex justify-between items-center mb-4 lg:mb-6">
            <div className="flex items-center gap-2">
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t(user.language, 'ingredients')}</h2>
                 <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-md">{t(user.language, 'servings')}</span>
            </div>
            
            {/* Compact Fridge Button */}
            <button 
                onClick={() => setShowFridgeModal(true)}
                className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-primary text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-full transition-colors group shadow-sm"
            >
                <span className="material-symbols-outlined text-sm group-hover:animate-pulse">center_focus_strong</span>
                <span className="text-xs font-bold">Fridge Scan</span>
            </button>
        </div>

        <div className="flex flex-wrap gap-4 pb-4">
            {(recipe.ingredients || []).map((ing, idx) => {
                // [SAFETY] Fallback for missing name to prevent crash on name[0]
                const safeName = ing.name || "Item";
                const firstChar = safeName.charAt(0) || "?";
                
                return (
                    <div key={idx} className="flex-shrink-0 w-24 flex flex-col items-center group">
                        <div className="w-16 h-16 rounded-full bg-white dark:bg-white/5 p-1 shadow-sm mb-3 border-2 border-transparent group-hover:border-primary transition-colors overflow-hidden relative">
                            {ing.image ? (
                                <img src={ing.image} className="w-full h-full object-cover rounded-full" alt={safeName}/>
                            ) : (
                                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold rounded-full">{firstChar}</div>
                            )}
                        </div>
                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 text-center leading-tight">{safeName}</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wide mt-0.5">{ing.amount || ''}</span>
                    </div>
                );
            })}
        </div>
    </div>
  );

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-24 animate-fade-in relative">
      
      {/* Main Container - Responsive Grid on Large Screens */}
      <div className="max-w-7xl mx-auto w-full lg:p-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start">
          
          {/* Back Button (Mobile Only) */}
          <div className="absolute top-6 left-6 z-30 lg:hidden">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-sm">
                  <span className="material-icons-round">arrow_back</span>
              </div>
          </div>

          {/* LEFT COLUMN (Desktop): Visuals & Key Info & Ingredients */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar">
              
              {/* Hero Image Container */}
              {/* FIX: Changed height from fixed pixels to vh for mobile balance */}
              <div className="relative w-full shadow-lg lg:rounded-[2rem] overflow-hidden flex-shrink-0">
                  <div className="relative h-[45vh] lg:h-[500px] w-full bg-gray-200 dark:bg-gray-800">
                    {/* Loading Overlay */}
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
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-12 lg:bottom-10 left-6 right-6 text-white">
                      <h1 className="text-2xl md:text-4xl lg:text-3xl font-bold leading-tight mb-3 font-display drop-shadow-lg">{recipe.title}</h1>
                      <div className="bg-white/20 backdrop-blur-md rounded-full p-1 pr-4 inline-flex items-center border border-white/20 gap-2">
                        <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
                            {user.currentSeason}
                        </span>
                        <span className="text-xs font-medium text-white/90 flex items-center gap-1">
                            {/* [FIX] Fallback for missing time */}
                            <span className="material-icons-round text-sm">timer</span> {recipe.time || '20 min'}
                        </span>
                      </div>
                    </div>
                  </div>
              </div>

              {/* Macros Card (Desktop: Below Image) */}
              <div className="hidden lg:flex justify-between items-center gap-2 px-2 bg-white dark:bg-white/5 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-white/5 flex-shrink-0">
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

            {/* Ingredients (Desktop only) */}
            {renderIngredients(true)}
          </div>

          {/* RIGHT COLUMN (Desktop): Details & Actions */}
          {/* FIX: Reduced top padding (pt-6) and negative margin (-mt-10) to tighten mobile layout */}
          <div className="relative z-10 -mt-10 lg:mt-0 lg:col-span-7 bg-background-light dark:bg-background-dark rounded-t-[2.5rem] lg:rounded-none px-6 pt-6 lg:pt-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] lg:shadow-none min-h-[50vh]">
            
             {/* Handle Bar (Mobile Only) - Reduced bottom margin */}
             <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4 lg:hidden"></div>

             {/* Macros (Mobile Only - Replicated here for mobile view) - Compacted padding/margin */}
             <div className="lg:hidden flex justify-between items-center gap-2 mb-8 px-2 bg-white dark:bg-white/5 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
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

            <div className="space-y-8 lg:space-y-10">
                {/* Ingredients (Mobile only) */}
                {renderIngredients(false)}

                {/* Preparation Steps */}
                <div className="pb-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 lg:mb-8">{t(user.language, 'preparation')}</h2>
                    <div className="space-y-10 relative pl-2">
                        <div className="absolute left-[15px] top-4 bottom-10 w-[2px] bg-gray-100 dark:bg-gray-800"></div>
                        {(recipe.steps || []).map((step, idx) => (
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