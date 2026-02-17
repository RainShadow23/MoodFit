import React, { useState } from 'react';
import { UserProfile, MBTI, BodyTarget, Gender, BoneStructure, Language, AIProvider } from '../types';
import { t } from '../i18n';
import { generateImage } from '../services/geminiService'; // Use the shared service

interface Props {
  user: UserProfile;
  onUpdate: (u: Partial<UserProfile>) => void;
  onClose: () => void;
}

const STATIC_ASSETS: Record<BodyTarget, string> = {
    [BodyTarget.Waist]: "https://plus.unsplash.com/premium_photo-1663045673565-a698be541699",
    [BodyTarget.Arms]: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop", 
    [BodyTarget.Legs]: "https://plus.unsplash.com/premium_photo-1661602053392-43a42976d9b2", 
    [BodyTarget.FullBody]: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop" 
};

const ProfileSetup: React.FC<Props> = ({ user, onUpdate, onClose }) => {
  const [generatingTarget, setGeneratingTarget] = useState<string | null>(null);
  const [aiImages, setAiImages] = useState<Partial<Record<BodyTarget, string>>>({});

  const targetMap: Record<BodyTarget, string> = {
    [BodyTarget.Waist]: t(user.language, 'target_belly'),
    [BodyTarget.Arms]: t(user.language, 'target_arms'),
    [BodyTarget.Legs]: t(user.language, 'target_thighs'),
    [BodyTarget.FullBody]: t(user.language, 'target_full')
  };

  const handleGenerateImage = async (e: React.MouseEvent, target: BodyTarget) => {
    e.stopPropagation(); 
    if (!user.useAI) {
        alert("Please enable AI Engine below to use this feature.");
        return;
    }
    
    setGeneratingTarget(target);

    try {
        // Dynamically set gender term
        const genderTerm = user.gender === Gender.Female ? "woman" : "man";
        const promptMap: Record<BodyTarget, string> = {
            [BodyTarget.Waist]: `Fitness photography, ${genderTerm} doing russian twists core exercise, gym lighting, high detail, 4k`,
            [BodyTarget.Arms]: `Fitness photography, ${genderTerm} lifting dumbbells, arm workout, gym lighting, 4k`,
            [BodyTarget.Legs]: `Fitness photography, ${genderTerm} doing leg raises, strong legs, gym atmosphere, 4k`,
            [BodyTarget.FullBody]: `Fitness photography, full body yoga stretch, ${genderTerm}, wellness studio, morning light, 4k`
        };

        // Call the shared service which handles switching internally based on user.aiProvider
        const imageUrl = await generateImage(promptMap[target], "1:1", user.aiProvider);

        if (imageUrl) {
            setAiImages(prev => ({ ...prev, [target]: imageUrl }));
        } else {
            alert("AI could not generate an image. Please check API Key.");
        }

    } catch (error) {
        console.error("Failed to generate image:", error);
        alert("Generation failed.");
    } finally {
        setGeneratingTarget(null);
    }
  };

  const handleResetImage = (e: React.MouseEvent, target: BodyTarget) => {
      e.stopPropagation();
      setAiImages(prev => {
          const next = { ...prev };
          delete next[target];
          return next;
      });
  };

  const tastes = [
      { id: 'Spicy', label: t(user.language, 'taste_spicy'), icon: '🌶️', color: 'bg-red-50 text-red-600 border-red-200' },
      { id: 'Sweet', label: t(user.language, 'taste_sweet'), icon: '🍫', color: 'bg-amber-50 text-amber-600 border-amber-200' },
      { id: 'Salty', label: t(user.language, 'taste_salty'), icon: '🥨', color: 'bg-orange-50 text-orange-600 border-orange-200' },
      { id: 'Fresh', label: t(user.language, 'taste_fresh'), icon: '🍋', color: 'bg-lime-50 text-lime-600 border-lime-200' },
      { id: 'Vegan', label: t(user.language, 'taste_vegan'), icon: '🌱', color: 'bg-green-50 text-green-600 border-green-200' },
  ];

  const allMbtis = [
    MBTI.ISTJ, MBTI.ISFJ, MBTI.INFJ, MBTI.INTJ,
    MBTI.ISTP, MBTI.ISFP, MBTI.INFP, MBTI.INTP,
    MBTI.ESTP, MBTI.ESFP, MBTI.ENFP, MBTI.ENTP,
    MBTI.ESTJ, MBTI.ESFJ, MBTI.ENFJ, MBTI.ENTJ
  ];

  const toggleTaste = (tasteId: string) => {
      const current = user.tastes || [];
      if (current.includes(tasteId)) {
          onUpdate({ tastes: current.filter(t => t !== tasteId) });
      } else {
          onUpdate({ tastes: [...current, tasteId] });
      }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-28 animate-fade-in relative z-50 font-display">
        
        {/* Header */}
        <header className="pt-12 pb-2 px-6 flex justify-between items-center sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm z-50">
            <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300">
                <span className="material-icons-round">arrow_back</span>
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{t(user.language, 'profile_setup')}</h1>
            <button onClick={onClose} className="text-primary font-bold text-sm bg-primary/10 px-4 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors">
                {t(user.language, 'save')}
            </button>
        </header>

        <main className="flex-1 px-6 space-y-10 pt-4">
            
            {/* 0. Name Input (New) */}
            <section className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-peach-light dark:bg-primary/20 flex items-center justify-center text-2xl animate-bounce-slow">
                    👋
                </div>
                <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        {t(user.language, 'name_label')}
                    </label>
                    <input
                        type="text"
                        value={user.name}
                        onChange={(e) => onUpdate({ name: e.target.value })}
                        placeholder="Enter your name"
                        className="w-full bg-transparent text-lg font-bold text-gray-900 dark:text-white focus:outline-none placeholder-gray-300 dark:placeholder-gray-600"
                    />
                </div>
            </section>

            {/* 1. Physical Identity */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-mint flex items-center justify-center text-white text-xs font-bold">1</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t(user.language, 'gender_identity')}</h3>
                </div>
                
                {/* Gender Toggle */}
                <div className="bg-peach-light dark:bg-white/5 p-1.5 rounded-2xl flex relative">
                    {Object.values(Gender).map((g) => {
                        const isSelected = user.gender === g;
                        return (
                            <button 
                                key={g}
                                onClick={() => onUpdate({ gender: g })}
                                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                                    isSelected 
                                    ? 'bg-primary text-white shadow-md' 
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'
                                }`}
                            >
                                {g}
                            </button>
                        );
                    })}
                </div>

                {/* Metrics Sliders */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Height */}
                    <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-baseline mb-4">
                            <span className="text-xs font-bold text-gray-400 uppercase">{t(user.language, 'height')}</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">{user.height} <span className="text-xs font-normal text-gray-500">cm</span></span>
                        </div>
                        <input 
                            type="range" min="140" max="200" value={user.height} 
                            onChange={(e) => onUpdate({ height: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                    {/* Weight */}
                    <div className="bg-white dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-baseline mb-4">
                            <span className="text-xs font-bold text-gray-400 uppercase">{t(user.language, 'weight')}</span>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">{user.weight} <span className="text-xs font-normal text-gray-500">kg</span></span>
                        </div>
                        <input 
                            type="range" min="40" max="150" value={user.weight} 
                            onChange={(e) => onUpdate({ weight: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>
                </div>
            </section>

            {/* 2. Body Shape */}
            <section className="space-y-4">
                 <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-mint flex items-center justify-center text-white text-xs font-bold">2</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t(user.language, 'bone_structure')}</h3>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                    {/* Ectomorph - Slim */}
                    <div 
                        onClick={() => onUpdate({ boneStructure: BoneStructure.Ectomorph })}
                        className={`cursor-pointer group p-2 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                            user.boneStructure === BoneStructure.Ectomorph 
                            ? 'bg-peach-light dark:bg-primary/10 border-primary' 
                            : 'bg-white dark:bg-white/5 border-transparent hover:border-primary/20'
                        }`}
                    >
                        <div className={`w-6 h-12 rounded-full border-2 ${user.boneStructure === BoneStructure.Ectomorph ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}></div>
                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Slim</span>
                    </div>

                    {/* Normal - Balanced */}
                    <div 
                        onClick={() => onUpdate({ boneStructure: BoneStructure.Normal })}
                        className={`cursor-pointer group p-2 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                            user.boneStructure === BoneStructure.Normal 
                            ? 'bg-peach-light dark:bg-primary/10 border-primary' 
                            : 'bg-white dark:bg-white/5 border-transparent hover:border-primary/20'
                        }`}
                    >
                         <div className={`w-8 h-12 rounded-lg border-2 ${user.boneStructure === BoneStructure.Normal ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}></div>
                         <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Normal</span>
                    </div>

                    {/* Mesomorph - Athletic */}
                    <div 
                        onClick={() => onUpdate({ boneStructure: BoneStructure.Mesomorph })}
                        className={`cursor-pointer group p-2 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                            user.boneStructure === BoneStructure.Mesomorph 
                            ? 'bg-peach-light dark:bg-primary/10 border-primary' 
                            : 'bg-white dark:bg-white/5 border-transparent hover:border-primary/20'
                        }`}
                    >
                        <div className={`w-10 h-12 relative`}>
                            <div className={`absolute top-0 w-full h-8 rounded-t-md ${user.boneStructure === BoneStructure.Mesomorph ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                             <div className={`absolute bottom-0 left-1.5 right-1.5 h-4 rounded-b-md ${user.boneStructure === BoneStructure.Mesomorph ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        </div>
                         <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Athletic</span>
                    </div>

                    {/* Endomorph - Soft */}
                    <div 
                        onClick={() => onUpdate({ boneStructure: BoneStructure.Endomorph })}
                        className={`cursor-pointer group p-2 py-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                            user.boneStructure === BoneStructure.Endomorph 
                            ? 'bg-peach-light dark:bg-primary/10 border-primary' 
                            : 'bg-white dark:bg-white/5 border-transparent hover:border-primary/20'
                        }`}
                    >
                         <div className={`w-10 h-10 rounded-full border-2 mt-1 ${user.boneStructure === BoneStructure.Endomorph ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}></div>
                         <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 mt-1">Soft</span>
                    </div>
                </div>
            </section>

            {/* 3. Target Areas (Image Cards - 3:2 Aspect Ratio) */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-mint flex items-center justify-center text-white text-xs font-bold">3</span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t(user.language, 'target_areas')}</h3>
                    </div>
                    {/* Feature Highlight for AI Gen */}
                    {user.useAI && (
                         <div className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                            <span className="material-icons-round text-[10px]">auto_awesome</span>
                            <span>{user.aiProvider} Gen</span>
                         </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { id: BodyTarget.Waist },
                        { id: BodyTarget.Arms },
                        { id: BodyTarget.Legs },
                        { id: BodyTarget.FullBody }
                    ].map((item) => {
                        const isSelected = user.targetArea === item.id;
                        const isGenerating = generatingTarget === item.id;
                        const hasGenerated = !!aiImages[item.id];
                        // DIRECT ACCESS TO STATIC ASSET (Bypassing State for Defaults)
                        const displayImage = aiImages[item.id] || STATIC_ASSETS[item.id];

                        return (
                             <button 
                                key={item.id}
                                onClick={() => onUpdate({ targetArea: item.id })}
                                className={`relative rounded-3xl overflow-hidden group border-4 transition-all aspect-[3/2] ${
                                    isSelected ? 'border-primary shadow-lg scale-[1.02]' : 'border-transparent shadow-sm'
                                }`}
                            >
                                {isGenerating ? (
                                    <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center gap-2 z-20">
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span className="text-xs text-white font-medium animate-pulse">Creating...</span>
                                    </div>
                                ) : (
                                    <img 
                                        src={displayImage} 
                                        alt={targetMap[item.id]} 
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                )}
                                
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity ${isSelected ? 'opacity-80' : 'opacity-60'}`}></div>
                                
                                <div className="absolute bottom-3 left-3 right-3 text-left">
                                    <span className="text-white text-sm font-extrabold leading-tight drop-shadow-md tracking-wide">
                                        {targetMap[item.id]}
                                    </span>
                                </div>

                                {/* Generate / Reset Buttons */}
                                {user.useAI && !isGenerating && (
                                    <div className="absolute top-2 left-2 z-30 flex gap-1">
                                         <div 
                                            onClick={(e) => handleGenerateImage(e, item.id)}
                                            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-indigo-600 transition-colors"
                                            title="Generate new image with AI"
                                        >
                                            <span className="material-icons-round text-sm">auto_awesome</span>
                                        </div>
                                        {hasGenerated && (
                                            <div 
                                                onClick={(e) => handleResetImage(e, item.id)}
                                                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-colors"
                                                title="Reset to default"
                                            >
                                                <span className="material-icons-round text-sm">restart_alt</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white shadow-sm border-2 border-white z-20">
                                        <span className="material-icons-round text-xs font-bold">check</span>
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            </section>

             {/* 4. Flavor Palette (Redesigned for Balance) */}
             <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-mint flex items-center justify-center text-white text-xs font-bold">4</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t(user.language, 'tastes_label')}</h3>
                </div>

                {/* Using a grid of large buttons instead of small chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {tastes.map((taste) => {
                        const isActive = (user.tastes || []).includes(taste.id);
                        return (
                            <button
                                key={taste.id}
                                onClick={() => toggleTaste(taste.id)}
                                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                                    isActive 
                                    ? `bg-peach-light border-primary text-primary shadow-md` 
                                    : 'bg-white dark:bg-white/5 border-transparent text-gray-500 hover:border-gray-200'
                                }`}
                            >
                                <span className="text-2xl mb-1">{taste.icon}</span>
                                <span className="text-xs font-bold">{taste.label}</span>
                            </button>
                        )
                    })}
                </div>
            </section>

            {/* 5. MBTI (Redesigned for Balance) */}
            <section className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t(user.language, 'mbti_type')}</h3>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                    {allMbtis.map(m => (
                        <button 
                            key={m}
                            onClick={() => onUpdate({ mbti: m })}
                            className={`h-14 rounded-xl text-xs font-bold transition-all border-2 flex items-center justify-center ${
                                user.mbti === m
                                ? 'bg-primary text-white border-primary shadow-lg transform scale-105'
                                : 'bg-gray-50 dark:bg-white/5 text-gray-500 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'
                            }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </section>

             {/* System Preferences */}
             <section className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-4">
                 
                 {/* AI Toggle + Provider Selector */}
                 <div className="flex flex-col gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                     <div className="flex items-center justify-between">
                         <div>
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t(user.language, 'ai_engine')}</h3>
                            <p className="text-[10px] text-gray-400">{t(user.language, 'ai_desc')}</p>
                         </div>
                         <button 
                            onClick={() => onUpdate({ useAI: !user.useAI })}
                            className={`w-10 h-6 rounded-full p-0.5 transition-colors ${user.useAI ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                         >
                             <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${user.useAI ? 'translate-x-4' : 'translate-x-0'}`}></div>
                         </button>
                     </div>
                     
                     {/* Provider Switcher (Visible only when AI is ON) */}
                     {user.useAI && (
                         <div className="flex bg-white dark:bg-black/20 p-1 rounded-lg border border-gray-200 dark:border-white/5">
                            <button
                                onClick={() => onUpdate({ aiProvider: AIProvider.Gemini })}
                                className={`flex-1 py-2 rounded-md text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                                    user.aiProvider === AIProvider.Gemini ? 'bg-indigo-500 text-white shadow-sm' : 'text-gray-400'
                                }`}
                            >
                                <span className="material-symbols-rounded text-sm">bolt</span>
                                Gemini (Speed)
                            </button>
                            <button
                                onClick={() => onUpdate({ aiProvider: AIProvider.OpenAI })}
                                className={`flex-1 py-2 rounded-md text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                                    user.aiProvider === AIProvider.OpenAI ? 'bg-green-600 text-white shadow-sm' : 'text-gray-400'
                                }`}
                            >
                                <span className="material-symbols-rounded text-sm">psychology</span>
                                GPT-4o (Quality)
                            </button>
                         </div>
                     )}
                 </div>

                 {/* Language Toggle */}
                 <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-white/5 rounded-xl">
                     <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t(user.language, 'language_settings')}</h3>
                        <p className="text-[10px] text-gray-400">{t(user.language, 'language_desc')}</p>
                     </div>
                     <div className="bg-white dark:bg-black/20 p-1 rounded-lg flex border border-gray-200 dark:border-white/5">
                        <button 
                            onClick={() => onUpdate({ language: Language.EN })}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${user.language === Language.EN ? 'bg-primary text-white shadow-sm' : 'text-gray-400'}`}
                        >
                            ENG
                        </button>
                        <button 
                            onClick={() => onUpdate({ language: Language.KO })}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${user.language === Language.KO ? 'bg-primary text-white shadow-sm' : 'text-gray-400'}`}
                        >
                            KOR
                        </button>
                     </div>
                 </div>
            </section>
        </main>
    </div>
  );
};

export default ProfileSetup;