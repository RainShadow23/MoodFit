import React from 'react';
import { Outfit, Workout, UserProfile, Season, Language, Recipe } from '../types';
import { t } from '../i18n';

interface Props {
  outfit: Outfit | undefined;
  workout: Workout | undefined;
  recipe: Recipe | undefined;
  quote: { text: string, author: string } | undefined;
  user: UserProfile;
  onSeasonChange: (s: Season) => void;
  onOpenProfile?: () => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const StyleWorkout: React.FC<Props> = ({ outfit, workout, recipe, quote, user, onSeasonChange, onOpenProfile, onRefresh, isLoading }) => {
  if (!outfit || !workout) return <div className="p-10 text-center animate-pulse">Loading Your Curated Look...</div>;

  const seasonLabels: Record<Season, string> = {
      [Season.Spring]: t(user.language, 'season_spring'),
      [Season.Summer]: t(user.language, 'season_summer'),
      [Season.Autumn]: t(user.language, 'season_autumn'),
      [Season.Winter]: t(user.language, 'season_winter'),
  }

  const getIconForType = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('coat') || t.includes('jacket') || t.includes('outer')) return 'apparel';
    if (t.includes('pants') || t.includes('trousers') || t.includes('jeans')) return 'styler';
    if (t.includes('shoe') || t.includes('sandal') || t.includes('boot')) return 'footprint';
    if (t.includes('top') || t.includes('shirt') || t.includes('tunic')) return 'checkroom';
    if (t.includes('bag') || t.includes('accessory')) return 'shopping_bag';
    return 'accessibility_new';
  }

  // --- REPORT GENERATION LOGIC ---
  const handleDownloadReport = () => {
    if (!outfit || !workout || !recipe || !quote) return;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="${user.language}">
    <head>
        <meta charset="UTF-8">
        <title>Luvit - Daily Personal Report</title>
        <style>
            body { font-family: 'Helvetica Neue', sans-serif; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; background: #fffaf5; }
            h1 { color: #ee6c2b; border-bottom: 2px solid #ee6c2b; padding-bottom: 10px; }
            h2 { color: #333; margin-top: 30px; font-size: 1.5rem; }
            h3 { margin-bottom: 5px; color: #221610; }
            h4 { margin-top: 15px; margin-bottom: 5px; color: #666; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
            .meta { font-size: 0.9rem; color: #666; margin-bottom: 30px; }
            .card { background: white; padding: 20px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 20px; border: 1px solid #eee; }
            .img-container { width: 100%; height: 300px; overflow: hidden; border-radius: 10px; margin-bottom: 15px; }
            img { width: 100%; height: 100%; object-fit: cover; }
            .quote { font-style: italic; font-size: 1.2rem; color: #555; text-align: center; padding: 20px; background: #fff; border-left: 4px solid #4ecdc4; margin: 20px 0; }
            .row { display: flex; gap: 20px; }
            .col { flex: 1; min-width: 0; }
            .tag { display: inline-block; background: #feece5; color: #c14f16; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem; margin-right: 5px; font-weight: bold; margin-bottom: 5px; }
            ul, ol { padding-left: 20px; margin-top: 5px; }
            li { margin-bottom: 5px; color: #555; font-size: 0.95rem; }
            .footer { margin-top: 50px; text-align: center; font-size: 0.8rem; color: #999; }
            @media (max-width: 600px) { .row { flex-direction: column; } }
        </style>
    </head>
    <body>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <h1>Luvit Daily Report</h1>
            <span style="font-weight: bold; color: #666;">${new Date().toLocaleDateString()}</span>
        </div>
        
        <div class="meta">
            User: <strong>${user.name}</strong> | MBTI: <strong>${user.mbti}</strong> | Mood: <strong>${user.currentMood}</strong> | Target: <strong>${user.targetArea}</strong>
        </div>

        <div class="quote">"${quote.text}" <br><span style="font-size: 0.9rem; color: #999;">— ${quote.author}</span></div>

        <div class="row">
            <div class="col">
                <div class="card">
                    <h2>Fashion Analysis</h2>
                    <div class="img-container"><img src="${outfit.image}" alt="Outfit"></div>
                    <h3>${outfit.title}</h3>
                    <p>${outfit.description}</p>
                    <p style="margin-top: 10px; font-style: italic; color: #ee6c2b;"><strong>Pro Tip:</strong> ${outfit.proTip}</p>
                    <div style="margin-top: 15px;">
                        ${outfit.items?.map(i => `<span class="tag">${i.name}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="card">
                    <h2>Recommended Meal</h2>
                    <div class="img-container"><img src="${recipe.image}" alt="Recipe"></div>
                    <h3>${recipe.title}</h3>
                    <div style="display: flex; gap: 15px; margin-bottom: 10px; font-weight: bold; font-size: 0.9rem; color: #4ecdc4;">
                        <span>🔥 ${recipe.calories} kcal</span>
                        <span>🥩 ${recipe.protein} Protein</span>
                        <span>⏱ ${recipe.time}</span>
                    </div>
                    
                    <h4>Ingredients</h4>
                    <ul>${recipe.ingredients.map(i => `<li>${i.name} (${i.amount})</li>`).join('')}</ul>

                    <h4>Preparation</h4>
                    <ol>
                        ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
        </div>

        <div class="card">
            <h2>Workout: ${workout.title}</h2>
            <p>Duration: <strong>${workout.duration}</strong> | Intensity: <strong>${workout.intensity}</strong></p>
            <ul>
                ${workout.exercises.map(ex => `<li><strong>${ex.name} (${ex.reps})</strong>: ${ex.description}</li>`).join('')}
            </ul>
        </div>

        <div class="footer">
            Generated by Luvit AI Personal Coach
        </div>
    </body>
    </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Luvit_Report_${new Date().toISOString().slice(0,10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-32 font-display">
        
        {/* Custom Header */}
        <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-6 pt-12 pb-4 flex justify-between items-center border-b border-peach-accent/30 dark:border-white/5">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-peach-accent/40 text-peach-dark text-xs font-bold uppercase tracking-wider">
                        {user.mbti} • {user.height}cm • {user.boneStructure}
                    </span>
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Style Analysis</h1>
            </div>
            <div className="flex gap-2">
                 {/* Download Report Button */}
                 <button 
                    onClick={handleDownloadReport}
                    className="w-10 h-10 rounded-full bg-mint-light dark:bg-mint/20 shadow-sm border border-mint/20 flex items-center justify-center text-mint-dark dark:text-mint transition-transform active:scale-95"
                    title="Download Report"
                >
                    <span className="material-symbols-rounded">download</span>
                </button>
                <button 
                    onClick={onOpenProfile}
                    className="w-10 h-10 rounded-full bg-white dark:bg-white/10 shadow-sm border border-peach-accent/20 flex items-center justify-center text-peach-dark dark:text-peach-accent transition-transform active:scale-95"
                >
                    <span className="material-symbols-rounded">person</span>
                </button>
            </div>
        </header>

        <main className="px-4 pt-6 space-y-8 animate-fade-in">
            {/* Season Filter */}
            <section>
                <div className="flex bg-white dark:bg-white/5 p-1.5 rounded-full shadow-sm overflow-x-auto no-scrollbar border border-peach-accent/20 dark:border-white/5">
                {Object.values(Season).map((s) => (
                    <button 
                        key={s}
                        onClick={() => onSeasonChange(s)}
                        className={`flex-1 px-4 py-2.5 rounded-full font-semibold text-sm shadow-sm transition-all whitespace-nowrap ${
                            user.currentSeason === s 
                            ? 'bg-peach-vibrant text-white shadow-md' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-peach-light dark:hover:bg-white/5'
                        }`}
                    >
                        {seasonLabels[s]}
                    </button>
                ))}
                </div>
            </section>

            {/* Curated Look Card */}
            <section className="space-y-6">
                <div className="flex justify-between items-end px-1">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t(user.language, 'style_card_title')}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Target Area: <span className="text-peach-vibrant font-semibold">{user.targetArea}</span></p>
                    </div>
                    {/* Refresh Button with AI Trigger */}
                    <button 
                        onClick={onRefresh}
                        disabled={isLoading}
                        className={`text-mint-dark text-sm font-semibold flex items-center bg-mint-light px-3 py-1 rounded-full shadow-sm active:scale-95 transition-transform ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? 'Creating...' : 'Refresh'} 
                        <span className={`material-symbols-rounded text-base ml-1 ${isLoading ? 'animate-spin' : ''}`}>
                            {isLoading ? 'autorenew' : 'refresh'}
                        </span>
                    </button>
                </div>

                <div className="relative group overflow-hidden rounded-[2rem] shadow-xl aspect-[3/4] border-4 border-white dark:border-white/10 ring-1 ring-peach-accent/30 bg-gray-100 dark:bg-gray-800">
                    {/* Loading Overlay or Image */}
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-100 dark:bg-gray-800 animate-pulse">
                            <span className="material-symbols-rounded text-4xl text-peach-vibrant animate-spin mb-2">auto_awesome</span>
                            <span className="text-xs text-gray-500 font-bold">AI is crafting your look...</span>
                        </div>
                    ) : (
                        <img 
                            src={outfit.image} 
                            alt={outfit.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex flex-wrap gap-2 mb-2">
                             {outfit.hashtags.slice(0, 2).map((tag, i) => (
                                <span key={i} className={`px-3 py-1 rounded-full backdrop-blur text-xs font-bold shadow-sm flex items-center ${i === 0 ? 'bg-peach-vibrant/90 text-white' : 'bg-white/20 border border-white/40 text-white'}`}>
                                    {i === 0 && <span className="material-symbols-rounded text-[14px] mr-1">check_circle</span>}
                                    {tag.replace('#', '')}
                                </span>
                            ))}
                        </div>
                        <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-md">{outfit.title}</h3>
                    </div>
                </div>

                {/* Component Pieces */}
                {outfit.items && outfit.items.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white px-1">Component Pieces</h4>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 snap-x">
                            {outfit.items.map((item, idx) => (
                                <div key={idx} className="snap-center shrink-0 w-28 bg-white dark:bg-white/5 p-3 rounded-2xl border border-peach-accent/30 dark:border-white/5 shadow-sm flex flex-col items-center text-center group">
                                    <div className="w-16 h-16 bg-peach-light dark:bg-white/10 rounded-full mb-3 flex items-center justify-center overflow-hidden transition-colors group-hover:bg-peach-accent/20">
                                        <span className="material-symbols-rounded text-3xl text-peach-vibrant">{getIconForType(item.name)}</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 leading-tight min-h-[2.5em] flex items-center justify-center">{item.name}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{item.type}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Why This Outfit */}
            <section className="bg-gradient-to-br from-peach-light to-white dark:from-peach-dark/20 dark:to-white/5 p-5 rounded-2xl border border-peach-accent/40 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <span className="material-symbols-rounded text-6xl text-peach-vibrant">psychology</span>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2 text-peach-dark dark:text-peach-accent font-bold text-sm">
                        <span className="material-symbols-rounded text-lg">auto_awesome</span>
                        Why this outfit?
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {outfit.description}
                    </p>
                </div>
            </section>

            {/* Workout Routine */}
            <section className="space-y-4 pt-4 border-t border-peach-accent/20 dark:border-white/5">
                <div className="flex justify-between items-center px-1">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{workout.title}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center bg-gray-200 dark:bg-white/10 px-2 py-0.5 rounded-md">
                                <span className="material-symbols-rounded text-xs mr-1">timer</span> {workout.duration}
                            </span>
                            <span className="text-xs font-medium text-mint-dark dark:text-mint-light flex items-center bg-mint-light dark:bg-mint-dark/40 px-2 py-0.5 rounded-md">
                                <span className="material-symbols-rounded text-xs mr-1">local_fire_department</span> {t(user.language, 'intensity')}: {workout.intensity}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    {workout.exercises.map((ex, idx) => (
                        <div key={idx} className="bg-white dark:bg-white/5 p-3 rounded-[1.5rem] flex items-center gap-4 shadow-sm border border-peach-accent/20 dark:border-white/5">
                            <div className="relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-peach-light dark:bg-peach-dark/30">
                                <img src={ex.image} alt={ex.name} className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white truncate">{ex.name}</h4>
                                    <span className="px-2 py-0.5 rounded-md bg-mint-light text-mint-dark text-xs font-bold whitespace-nowrap">{ex.reps}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{ex.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 pb-2">
                    <button className="w-full bg-peach-vibrant hover:bg-peach-dark text-white font-bold py-4 rounded-full shadow-lg shadow-peach-vibrant/30 flex items-center justify-center gap-2 transform transition active:scale-95">
                        <span className="material-symbols-rounded">fitness_center</span>
                        {t(user.language, 'start_workout')}
                    </button>
                </div>
            </section>
        </main>
    </div>
  );
};

export default StyleWorkout;