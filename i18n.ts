import { Language } from "./types";

export const TRANSLATIONS = {
  [Language.EN]: {
    // Nav
    nav_home: "Home",
    nav_wardrobe: "Wardrobe",
    nav_meals: "Meals",
    nav_profile: "Profile",
    
    // Header
    good_morning: "Good Morning",
    
    // Dashboard
    mood_question: "How are you feeling?",
    insight_title: "Today's Insight",
    insight_loading: "Loading inspiration...",
    progress_title: "Personalization Progress",
    progress_desc: "Complete your profile for 2x more accurate recommendations.",
    finish_now: "Finish Now",
    style_card_title: "Today's Best Look",
    style_card_desc: "Based on target area & mood",
    meal_card_title: "Recommended Meal",
    meal_card_desc: "Mood boosting ingredients",
    
    // Recipe
    kcal: "Kcal",
    protein: "Protein",
    focus: "Focus",
    ingredients: "Ingredients",
    servings: "4 Servings",
    missing_ingredients: "Missing ingredients?",
    scan_fridge: "Scan fridge for smart substitutes",
    preparation: "Preparation",
    step: "Step",
    prep_time: "Prep time",
    fridge_modal_title: "What's in your fridge?",
    fridge_placeholder: "e.g., 2 eggs, tomato, spinach, leftover chicken...",
    cook_button: "Create Recipe",
    cancel_button: "Cancel",
    
    // Style & Workout
    season_spring: "Spring",
    season_summer: "Summer",
    season_autumn: "Autumn",
    season_winter: "Winter",
    style_tips: "Style Tips",
    see_all: "See All",
    pro_tip: "Pro Tip",
    start_workout: "Start Targeted Workout",
    intensity: "Intensity",
    
    // Profile
    profile_setup: "Profile Setup",
    save: "Save",
    customize_avatar: "Tap to customize your virtual double",
    gender_identity: "Physical Identity", // Renamed as requested logic (though kept key same)
    bone_structure: "Body Shape",
    guide: "Guide",
    selected: "Selected",
    target_areas: "Target Goals",
    focus_label: "Focus",
    focus_desc: "We'll curate content to help you tone and style this area.",
    mbti_type: "Personality (MBTI)",
    take_test: "Take the test",
    view_all_types: "View all 16 types",
    show_less: "Show Less",
    ai_engine: "AI Recommendation Engine",
    ai_desc: "Use Gemini API for dynamic content",
    language_settings: "Language Settings",
    language_desc: "Choose your preferred language",
    
    // New Profile Fields
    name_label: "Name / Nickname",
    height: "Height",
    weight: "Weight",
    tastes_label: "Flavor Palette",
    taste_spicy: "Spicy",
    taste_sweet: "Sweet",
    taste_salty: "Salty/Savory",
    taste_fresh: "Fresh/Zesty",
    taste_vegan: "Vegan",
    
    // Body Targets
    target_belly: "Belly & Core",
    target_arms: "Arms & Shoulders",
    target_thighs: "Thighs & Hips",
    target_full: "Full Body Balance",
  },
  [Language.KO]: {
    // Nav
    nav_home: "홈",
    nav_wardrobe: "옷장",
    nav_meals: "식단",
    nav_profile: "프로필",
    
    // Header
    good_morning: "좋은 아침입니다",
    
    // Dashboard
    mood_question: "오늘 기분은 어떠신가요?",
    insight_title: "오늘의 영감",
    insight_loading: "영감을 불러오는 중...",
    progress_title: "프로필 완성도",
    progress_desc: "프로필을 완성하고 2배 더 정확한 추천을 받아보세요.",
    finish_now: "완성하기",
    style_card_title: "오늘의 베스트 룩",
    style_card_desc: "체형과 기분을 고려한 추천",
    meal_card_title: "추천 식단",
    meal_card_desc: "기분 전환을 위한 재료",
    
    // Recipe
    kcal: "칼로리",
    protein: "단백질",
    focus: "포커스",
    ingredients: "재료",
    servings: "4인분",
    missing_ingredients: "재료가 부족한가요?",
    scan_fridge: "냉장고를 스캔하여 대체 재료 찾기",
    preparation: "조리 순서",
    step: "단계",
    prep_time: "조리 시간",
    fridge_modal_title: "냉장고에 무엇이 있나요?",
    fridge_placeholder: "예: 계란 2개, 토마토, 시금치, 남은 치킨...",
    cook_button: "레시피 생성",
    cancel_button: "취소",
    
    // Style & Workout
    season_spring: "봄",
    season_summer: "여름",
    season_autumn: "가을",
    season_winter: "겨울",
    style_tips: "스타일 팁",
    see_all: "전체 보기",
    pro_tip: "프로 팁",
    start_workout: "타겟 운동 시작하기",
    intensity: "강도",
    
    // Profile
    profile_setup: "프로필 설정",
    save: "저장",
    customize_avatar: "탭하여 가상 아바타 꾸미기",
    gender_identity: "신체 프로필",
    bone_structure: "나의 체형",
    guide: "가이드",
    selected: "선택됨",
    target_areas: "집중 관리 목표",
    focus_label: "포커스",
    focus_desc: "선택한 부위에 맞춰 운동과 스타일링을 제안합니다.",
    mbti_type: "성격 유형 (MBTI)",
    take_test: "검사 하러가기",
    view_all_types: "16가지 유형 모두 보기",
    show_less: "접기",
    ai_engine: "AI 추천 엔진",
    ai_desc: "Gemini API를 사용하여 실시간 맞춤 추천",
    language_settings: "언어 설정",
    language_desc: "선호하는 언어를 선택하세요",

    // New Profile Fields
    name_label: "이름 / 닉네임",
    height: "키",
    weight: "몸무게",
    tastes_label: "선호하는 입맛",
    taste_spicy: "매콤한",
    taste_sweet: "달콤한",
    taste_salty: "담백/고소한",
    taste_fresh: "상큼한",
    taste_vegan: "비건 (Vegan)",

    // Body Targets
    target_belly: "복부 (뱃살)",
    target_arms: "팔뚝 & 어깨",
    target_thighs: "허벅지 & 엉덩이",
    target_full: "전신 밸런스",
  }
};

export const t = (lang: Language, key: keyof typeof TRANSLATIONS[Language.EN]): string => {
  return TRANSLATIONS[lang][key] || TRANSLATIONS[Language.EN][key];
};