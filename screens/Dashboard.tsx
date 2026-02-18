import React from 'react';
import { UserProfile, RecommendationResult, Mood } from '../types';
import { t } from '../i18n';

interface DashboardProps {
  user: UserProfile;
  data: RecommendationResult | null;
  onMoodChange: (mood: Mood) => void;
  onNavigate: (screen: 'style' | 'diet') => void;
  onOpenProfile: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, data, onMoodChange, onNavigate, onOpenProfile }) => {
  const moods = [
    { value: Mood.Happy, icon: '😃', label: 'Happy' },
    { value: Mood.Calm, icon: '😌', label: 'Calm' },
    { value: Mood.Tired, icon: '😴', label: 'Tired' },
    { value: Mood.Anxious, icon: '😟', label: 'Anxious' },
  ];

  return (
    <div className="space-y-6 pb-24 animate-fade-in max-w-6xl mx-auto w-full">
      {/* Mood Selector - Full Width */}
      <section>
        <div className="flex justify-between items-end mb-4 px-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t(user.language, 'mood_question')}</h2>
          <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/10">
            {user.mbti}
          </span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-6">
          {moods.map((m) => {
            const isActive = user.currentMood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => onMoodChange(m.value)}
                className={`flex flex-col items-center gap-2 min-w-[70px] group transition-all ${isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg transition-transform border-4 ${isActive ? 'bg-primary text-white shadow-primary/30 border-white dark:border-background-dark' : 'bg-white dark:bg-white/5 text-gray-400 border-transparent'}`}>
                  {m.icon}
                </div>
                <span className={`text-xs font-semibold ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grid Layout: 1 Col (Mobile) -> 2 Col (Tablet) -> 3 Col (Desktop) */}
      {/* This ensures cards stay vertical and don't stretch into wide rectangles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
          
          {/* Column 1: Stats & Insights */}
          <div className="space-y-6 flex flex-col">
              {/* Insight Card */}
              <section className="bg-white dark:bg-primary/10 p-6 rounded-3xl relative overflow-hidden shadow-sm flex-1 min-h-[160px] flex flex-col justify-center border border-gray-100 dark:border-white/5">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-mint-light dark:bg-mint/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <span className="material-icons-round text-sm">auto_awesome</span>
                    <span className="text-xs font-bold uppercase tracking-widest">{t(user.language, 'insight_title')}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2 font-serif italic">
                    "{data?.quote.text || t(user.language, 'insight_loading')}"
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">– {data?.quote.author}</p>
                </div>
              </section>

              {/* Personalization Progress */}
              <section className="bg-mint-light dark:bg-mint/10 rounded-3xl p-5 flex items-center justify-between gap-4 border border-mint/20 dark:border-mint/10">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-gray-700 dark:text-mint uppercase tracking-wider">{t(user.language, 'progress_title')}</h4>
                    <span className="text-xs font-bold text-mint">40%</span>
                  </div>
                  <div className="w-full bg-white dark:bg-gray-700 rounded-full h-1.5">
                    <div className="bg-mint h-1.5 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-tight pr-2">
                    {t(user.language, 'progress_desc')}
                  </p>
                </div>
                <button 
                  onClick={onOpenProfile}
                  className="flex-shrink-0 bg-white dark:bg-mint text-mint dark:text-background-dark text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md transition-shadow active:scale-95 transform duration-150"
                >
                  {t(user.language, 'finish_now')}
                </button>
              </section>
          </div>

          {/* Column 2: Style Card */}
          {data?.outfit && (
            <div 
              onClick={() => onNavigate('style')}
              className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full border border-gray-100 dark:border-white/5"
            >
                {/* Image Area - Fixed Aspect Ratio */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={data.outfit.image} alt="Outfit" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4">
                        <span className="bg-white/90 dark:bg-black/60 backdrop-blur text-gray-900 dark:text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                        <span className="material-icons-round text-sm text-primary">wb_sunny</span> 24°C Sunny
                    </span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                             <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t(user.language, 'style_card_title')}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{data.outfit.title}</p>
                             </div>
                             <button className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center text-gray-400 dark:text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-icons-round text-sm">arrow_forward</span>
                             </button>
                        </div>
                         <div className="flex flex-wrap gap-2 mt-3">
                            {data.outfit.tags.slice(0,2).map((tag, i) => (
                                <span key={i} className={`${i===0 ? 'bg-peach-light text-primary' : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300'} text-[10px] font-bold px-3 py-1 rounded-full capitalize`}>{tag.replace('_', ' ')}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          )}

          {/* Column 3: Meal Card */}
          {data?.recipe && (
            <div 
              onClick={() => onNavigate('diet')}
              className="bg-white dark:bg-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col h-full border border-gray-100 dark:border-white/5"
            >
                 {/* Image Area - Fixed Aspect Ratio */}
                 <div className="relative w-full aspect-[4/3] lg:aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={data.recipe.image} alt="Meal" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-4 left-4 text-white drop-shadow-md">
                        <div className="flex items-center gap-1 text-xs font-medium mb-1">
                            {/* [FIX] Fallback for missing time */}
                            <span className="material-icons-round text-sm text-primary">timer</span> {data.recipe.time || '20 min'}
                        </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                             <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t(user.language, 'meal_card_title')}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{data.recipe.title}</p>
                                </div>
                                <button className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/10 flex items-center justify-center text-gray-400 dark:text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-icons-round text-sm">arrow_forward</span>
                                </button>
                            </div>

                            {/* Macros Row */}
                            <div className="flex items-center gap-4 mt-4 bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t(user.language, 'kcal')}</span>
                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{data.recipe.calories}</span>
                                </div>
                                <div className="w-px h-8 bg-gray-200 dark:bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t(user.language, 'protein')}</span>
                                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{data.recipe.protein}</span>
                                </div>
                            </div>
                        </div>
                  </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Dashboard;