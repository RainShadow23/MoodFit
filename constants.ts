import { Recipe, Outfit, Workout, Mood, Season, MBTI, BodyTarget, Language } from './types';

// Mock Data acting as Local DB

const MOCK_RECIPES_EN: Recipe[] = [
  {
    id: 'r1',
    tags: [Mood.Happy, Mood.Energetic, Season.Summer, Season.Autumn, MBTI.ENFP, 'healthy_fats'],
    title: "Citrus Salmon & Avocado Poke Bowl",
    calories: 450,
    protein: "30g",
    time: "15m",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH2eWSWLEdn69m5agl0VkFnSKxumdPkstJprCYj28rLQGpbQtyBxnT0Gh73-_EXjXt61unz1Ayq9MiE18C764oYZVvQfqff5V8YUmprVl8ZcxFn8rIEoiMrXyCZYxKQQvsmJ_wjmj8vydIj9D3YtTFR0BoiN2Ze6UlpEaxi--bSYfsd5-iSEt7-KjKtMVgKak4AU1H7QsvmZAnmRdohz5CS6fbXF0Hg0DCw_-56Bl_17MNOINYv2HoQ7DtTVt0e8WbaNoWNgKskY4",
    ingredients: [
      { name: "Salmon", amount: "150g", origin: "Norway", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ-a44K6w5LcALfblUjx_QghDLsJjPQSiep14zR_DaCmXIXKGd4glFxUNHXBYAFAUlLL4__UMWZ7UARRz5eeNgwzDshE2YkZJe_4qywH8Yfhe-6IjDS7gwiAqCik30FMmQ8euWJdjeYNiSG4wmogn145dhBaxETGIdnFZvOyZFsM7e4ghl8eT5r1YppYdn-u5Ibfc5bY4sKGHpK0CEf9JEs1oWY_NfF8GWa6K3OpxBcSdcTa9RYvV9r-8k41Dd0igQ9__fKsoAuLU" },
      { name: "Avocado", amount: "1/2", origin: "Mexico", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxoPrFKbRDO2vf-GugqOXXPrmpV5sHTC5LQkLLhihxYDGJ0k1pWDRlA7q_q_Jdzj1WHqgDQCrKw_2jhn5SRCb9Yjd9XAdMv9iem5YISbZmk-lfjF-b_g7m-BSRI9P3fcSYi4XS9Avyi1Akgtpqw8C9IyewWKZfPNS0vnw66tadBXx5DblfXxpLv1syyuVTN8nn_wJ-WnN-zpKA5qfdNVxWQ7GgbzwhiNmwNzAhZl2Eu58o_YF5qVHt5AALniPwG6hyESxHX1NrKaM" },
      { name: "Brown Rice", amount: "1 cup", origin: "Whole", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAR8ngDnYAVf5BBeENnMxJZYpPTTDCzX9ameOB_h2XQWzfq1ASnzihnz5C17RsSAe8ha2EpLw6Q4p6j2otqaFBDgRA6I1caf_I_Yp3JVuc0-pnzpZDjrnh4q7wirSloBStiO30dJubnTwno2PXh55KmFwP_TFxA8UJ6cjEFV6VlUcAj_xBwgkZRe3BbCOpxDs6nq9AIrx35mSu5WK7HkxyugBqJ50AvrW_S7t02J4QBa4egqB2MPLpoM54q_BMpUsfnGIosKrk4IyY" },
    ],
    steps: [
      "Prepare the base: Rinse brown rice and cook.",
      "Slice the Salmon: Cut into 1/2 inch cubes.",
      "Mix the sauce: Soy sauce, sesame oil, and ginger.",
      "Assemble and serve chilled."
    ],
    badge: "98% Match"
  },
  {
    id: 'r2',
    tags: [Mood.Tired, Mood.Anxious, Season.Winter, 'comfort_food'],
    title: "Warm Pumpkin & Ginger Soup",
    calories: 320,
    protein: "8g",
    time: "25m",
    image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2b?q=80&w=600&auto=format&fit=crop",
    ingredients: [
      { name: "Pumpkin", amount: "400g" },
      { name: "Ginger", amount: "1 inch" },
      { name: "Coconut Milk", amount: "200ml" }
    ],
    steps: ["Roast pumpkin", "Blend with spices", "Simmer with coconut milk"],
    badge: "Comfort Pick"
  }
];

const MOCK_RECIPES_KO: Recipe[] = [
  {
    id: 'r1',
    tags: [Mood.Happy, Mood.Energetic, Season.Summer, Season.Autumn, MBTI.ENFP, 'healthy_fats'],
    title: "시트러스 연어 & 아보카도 포케",
    calories: 450,
    protein: "30g",
    time: "15분",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH2eWSWLEdn69m5agl0VkFnSKxumdPkstJprCYj28rLQGpbQtyBxnT0Gh73-_EXjXt61unz1Ayq9MiE18C764oYZVvQfqff5V8YUmprVl8ZcxFn8rIEoiMrXyCZYxKQQvsmJ_wjmj8vydIj9D3YtTFR0BoiN2Ze6UlpEaxi--bSYfsd5-iSEt7-KjKtMVgKak4AU1H7QsvmZAnmRdohz5CS6fbXF0Hg0DCw_-56Bl_17MNOINYv2HoQ7DtTVt0e8WbaNoWNgKskY4",
    ingredients: [
      { name: "연어", amount: "150g", origin: "노르웨이", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJ-a44K6w5LcALfblUjx_QghDLsJjPQSiep14zR_DaCmXIXKGd4glFxUNHXBYAFAUlLL4__UMWZ7UARRz5eeNgwzDshE2YkZJe_4qywH8Yfhe-6IjDS7gwiAqCik30FMmQ8euWJdjeYNiSG4wmogn145dhBaxETGIdnFZvOyZFsM7e4ghl8eT5r1YppYdn-u5Ibfc5bY4sKGHpK0CEf9JEs1oWY_NfF8GWa6K3OpxBcSdcTa9RYvV9r-8k41Dd0igQ9__fKsoAuLU" },
      { name: "아보카도", amount: "1/2개", origin: "멕시코", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxoPrFKbRDO2vf-GugqOXXPrmpV5sHTC5LQkLLhihxYDGJ0k1pWDRlA7q_q_Jdzj1WHqgDQCrKw_2jhn5SRCb9Yjd9XAdMv9iem5YISbZmk-lfjF-b_g7m-BSRI9P3fcSYi4XS9Avyi1Akgtpqw8C9IyewWKZfPNS0vnw66tadBXx5DblfXxpLv1syyuVTN8nn_wJ-WnN-zpKA5qfdNVxWQ7GgbzwhiNmwNzAhZl2Eu58o_YF5qVHt5AALniPwG6hyESxHX1NrKaM" },
      { name: "현미밥", amount: "1공기", origin: "국산", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAR8ngDnYAVf5BBeENnMxJZYpPTTDCzX9ameOB_h2XQWzfq1ASnzihnz5C17RsSAe8ha2EpLw6Q4p6j2otqaFBDgRA6I1caf_I_Yp3JVuc0-pnzpZDjrnh4q7wirSloBStiO30dJubnTwno2PXh55KmFwP_TFxA8UJ6cjEFV6VlUcAj_xBwgkZRe3BbCOpxDs6nq9AIrx35mSu5WK7HkxyugBqJ50AvrW_S7t02J4QBa4egqB2MPLpoM54q_BMpUsfnGIosKrk4IyY" },
    ],
    steps: [
      "현미밥을 지어 준비합니다.",
      "연어를 1.5cm 큐브 모양으로 깍둑썰기 합니다.",
      "소스 만들기: 간장, 참기름, 생강을 섞어주세요.",
      "모든 재료를 예쁘게 담아 소스와 함께 냅니다."
    ],
    badge: "98% 일치"
  },
  {
    id: 'r2',
    tags: [Mood.Tired, Mood.Anxious, Season.Winter, 'comfort_food'],
    title: "따뜻한 단호박 생강 수프",
    calories: 320,
    protein: "8g",
    time: "25분",
    image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2b?q=80&w=600&auto=format&fit=crop",
    ingredients: [
      { name: "단호박", amount: "400g" },
      { name: "생강", amount: "1톨" },
      { name: "코코넛 밀크", amount: "200ml" }
    ],
    steps: ["단호박을 구워주세요", "향신료와 함께 블렌더에 갑니다", "코코넛 밀크를 넣고 끓여냅니다"],
    badge: "위로가 되는 맛"
  }
];

const MOCK_OUTFITS_EN: Outfit[] = [
  {
    id: 'o1',
    tags: [Season.Autumn, Season.Winter, BodyTarget.Waist, Mood.Energetic, 'chic'],
    title: "Structured Layering",
    description: "Balances structured layering with flow. High-waist definition targets your goal to minimize waist focus.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEmgYTP2H1Vkzuwjdfewrn66UBq6SERUA1gN05Sxhw3OC7ZcK5G1aFLZ4gWMnBk5B7Nh8dyWmxkx5Vv25MSYVpWK5GHklZwRutdhJIxxiqXhbL1cP3WNWxlUUt27B_hVhE90yczucegHEcIoIM0_EC1rWni6diZYUbLTSrXtD0x0Ye5EaxZ1h6jv7mjXzT_jPX6EAbH8j3zYUkQLIEaBf6CtR2RDEvxodsNfiDuR7B25pRhCMBunbnAKN1xzDMLxI5ZFSR2Bv7F7Y",
    proTip: "Belt over coat",
    hashtags: ["#WaistFriendly", "#RelaxedFit"],
    items: [
        { name: "Oversized Coat", type: "Camel Wool" },
        { name: "Belted Tunic", type: "High Waist" },
        { name: "Slim Trousers", type: "Black Crepe" },
        { name: "Mini Leather Bag", type: "Accessory" } 
    ]
  },
  {
    id: 'o2',
    tags: [Season.Summer, Season.Spring, BodyTarget.Legs, Mood.Happy, 'casual'],
    title: "Elongated High-Rise",
    description: "High-waisted linen trousers paired with a cropped top to maximize leg length.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBc8R4hCxHrQp4_LMkiscUyIsM3RR8o_pPtJpWID0B04UUfv2H4DyyXo6jnPq_GGQVVDdb48etJU3mVUPLNCnjQHdIcg2qFbeTgFzG8TLnAtxiH4fdu7xLE8sTtTM-JEiAr3uP5UPYuGilCcnOXzjCBj2wBQfWQemfxZJ5dDlDXxt3yyj4LWt7qMuH80Mp-luBOX3OG1D_yvgxl_AwBnkLfZ8L2UKXpOTlm7Y8fI_8yF2gzC1JU4u-72O4rnNtnfdJxlT_fXzyxPJQ",
    proTip: "Tuck it in",
    hashtags: ["#LegsForDays", "#SummerBreeze"],
    items: [
        { name: "Crop Top", type: "Linen" },
        { name: "High-Rise Pants", type: "Wide Leg" },
        { name: "Platform Sandals", type: "Espadrille" },
        { name: "Woven Tote", type: "Accessory" }
    ]
  }
];

const MOCK_OUTFITS_KO: Outfit[] = [
  {
    id: 'o1',
    tags: [Season.Autumn, Season.Winter, BodyTarget.Waist, Mood.Energetic, 'chic'],
    title: "구조적인 레이어링",
    description: "흐르는 듯한 핏과 구조적인 실루엣의 조화. 하이웨이스트 디테일로 허리 라인을 자연스럽게 커버합니다.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEmgYTP2H1Vkzuwjdfewrn66UBq6SERUA1gN05Sxhw3OC7ZcK5G1aFLZ4gWMnBk5B7Nh8dyWmxkx5Vv25MSYVpWK5GHklZwRutdhJIxxiqXhbL1cP3WNWxlUUt27B_hVhE90yczucegHEcIoIM0_EC1rWni6diZYUbLTSrXtD0x0Ye5EaxZ1h6jv7mjXzT_jPX6EAbH8j3zYUkQLIEaBf6CtR2RDEvxodsNfiDuR7B25pRhCMBunbnAKN1xzDMLxI5ZFSR2Bv7F7Y",
    proTip: "코트 위에 벨트 착용",
    hashtags: ["#허리커버", "#편안한핏"],
    items: [
        { name: "오버사이즈 코트", type: "카멜 울" },
        { name: "벨티드 튜닉", type: "하이웨이스트" },
        { name: "슬림 슬랙스", type: "블랙 크레이프" },
        { name: "미니 레더 백", type: "액세서리" }
    ]
  },
  {
    id: 'o2',
    tags: [Season.Summer, Season.Spring, BodyTarget.Legs, Mood.Happy, 'casual'],
    title: "다리가 길어보이는 하이라이즈",
    description: "하이웨이스트 린넨 팬츠와 크롭 탑을 매치하여 다리 길이를 극대화하세요.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBc8R4hCxHrQp4_LMkiscUyIsM3RR8o_pPtJpWID0B04UUfv2H4DyyXo6jnPq_GGQVVDdb48etJU3mVUPLNCnjQHdIcg2qFbeTgFzG8TLnAtxiH4fdu7xLE8sTtTM-JEiAr3uP5UPYuGilCcnOXzjCBj2wBQfWQemfxZJ5dDlDXxt3yyj4LWt7qMuH80Mp-luBOX3OG1D_yvgxl_AwBnkLfZ8L2UKXpOTlm7Y8fI_8yF2gzC1JU4u-72O4rnNtnfdJxlT_fXzyxPJQ",
    proTip: "상의 넣어 입기",
    hashtags: ["#롱다리코디", "#여름바람"],
    items: [
        { name: "크롭 탑", type: "린넨" },
        { name: "와이드 팬츠", type: "하이라이즈" },
        { name: "플랫폼 샌들", type: "에스파듀" },
        { name: "라탄 토트백", type: "액세서리" }
    ]
  }
];

const MOCK_WORKOUTS_EN: Workout[] = [
  {
    id: 'w1',
    tags: [BodyTarget.Waist, Mood.Energetic, 'core'],
    title: "Waist Snatcher Routine",
    duration: "10 Mins",
    intensity: "Med",
    exercises: [
      {
        name: "Russian Twists",
        reps: "15 Reps",
        description: "Sit on floor, lean back slightly, twist torso side to side.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdT9b1WgIJ6yv7s2eu6scqWi22tqpkvWMdkA8i6EfREb-pbvbvyAYIP252DQkj1BNMg1PJfmqZkS1EbH19q18nWWSz-AZNz9XIW6y85kXmpOdJnrs3deZk0JiNhUSGxdSfuKmYbnJJPIb8ZZTMnMf0pY3RKgTzrM6XnqWgf7SFZ_g4cZBoUux890kG5mnubgoRrdHR39uZrTxD-XZKYIsX0WOpzKEWi3JejtJh0N6sE4Cl16R4m2JeolYknXaNpuBaC6ER6gZT3F8"
      },
      {
        name: "Side Planks",
        reps: "30s / Side",
        description: "Lift hips to form a straight line from head to heels.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9DeVI13KTUy-2BEiG5zln9I40HMBgyW2_Hrfj9534FBnKzRdYRDoVKUAuAfGLtOsQLgRlzV02NwCrlKVWn4C4oWZOk7GJRBbSHcyzdXoeqhRIptVXy2gsEFm2YeYDTNvZA9SmLVHsK0wrSsri8155zGESMBLQ4xJQyH604QuckqFHeP3fp1_rBc-uQM6aqcsbApKXHKPeBhI9X123G-1Upi4Kotg31FHjMiGcyO9HmmxC6SjolD-X817nvJWw5rhjJrSsSlWNNvo"
      },
       {
        name: "Bicycle Crunches",
        reps: "20 Reps",
        description: "Bring opposite elbow to knee in a pedaling motion.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwwX1IK4lvC7BMvVo_JNgTCtnOMLFaolyJEeNtbOCd_PUdW8TzdirEni9BJDdtXfbpnU5UtqL7At_1eGfNqL7b0wvMn0L9bSMxhYg85hIJAZRuOeq5DWBVHs1c6e3Am75ifFD5QinpLKnvgw5IuRU2Zr637KkVdBoDdveGJZXR-IUAgdOIle8DXm432HSrViS8vJXJfZ9ac7atTCq7VOs6D8wkgO_Gdrr7CzQuua0OqGfJ39WgqP5UeNvkH6h1suk3KQD2ZqiW2PQ"
      }
    ]
  },
   {
    id: 'w2',
    tags: [BodyTarget.Legs, Mood.Tired, 'stretch'],
    title: "Lazy Leg Sculpt",
    duration: "15 Mins",
    intensity: "Low",
    exercises: [
      {
        name: "Lying Leg Raises",
        reps: "12 Reps",
        description: "Lie flat and lift legs without bending knees.",
        image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=200"
      }
    ]
  }
];

const MOCK_WORKOUTS_KO: Workout[] = [
  {
    id: 'w1',
    tags: [BodyTarget.Waist, Mood.Energetic, 'core'],
    title: "잘록한 허리 라인 루틴",
    duration: "10분",
    intensity: "Med",
    exercises: [
      {
        name: "러시안 트위스트",
        reps: "15회",
        description: "바닥에 앉아 상체를 약간 뒤로 젖힌 후, 몸통을 좌우로 비틉니다.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdT9b1WgIJ6yv7s2eu6scqWi22tqpkvWMdkA8i6EfREb-pbvbvyAYIP252DQkj1BNMg1PJfmqZkS1EbH19q18nWWSz-AZNz9XIW6y85kXmpOdJnrs3deZk0JiNhUSGxdSfuKmYbnJJPIb8ZZTMnMf0pY3RKgTzrM6XnqWgf7SFZ_g4cZBoUux890kG5mnubgoRrdHR39uZrTxD-XZKYIsX0WOpzKEWi3JejtJh0N6sE4Cl16R4m2JeolYknXaNpuBaC6ER6gZT3F8"
      },
      {
        name: "사이드 플랭크",
        reps: "30초/방향",
        description: "엉덩이를 들어 머리부터 발끝까지 일직선을 유지합니다.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9DeVI13KTUy-2BEiG5zln9I40HMBgyW2_Hrfj9534FBnKzRdYRDoVKUAuAfGLtOsQLgRlzV02NwCrlKVWn4C4oWZOk7GJRBbSHcyzdXoeqhRIptVXy2gsEFm2YeYDTNvZA9SmLVHsK0wrSsri8155zGESMBLQ4xJQyH604QuckqFHeP3fp1_rBc-uQM6aqcsbApKXHKPeBhI9X123G-1Upi4Kotg31FHjMiGcyO9HmmxC6SjolD-X817nvJWw5rhjJrSsSlWNNvo"
      },
       {
        name: "바이시클 크런치",
        reps: "20회",
        description: "자전거를 타듯 다리를 움직이며 반대쪽 팔꿈치와 무릎을 닿게 합니다.",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwwX1IK4lvC7BMvVo_JNgTCtnOMLFaolyJEeNtbOCd_PUdW8TzdirEni9BJDdtXfbpnU5UtqL7At_1eGfNqL7b0wvMn0L9bSMxhYg85hIJAZRuOeq5DWBVHs1c6e3Am75ifFD5QinpLKnvgw5IuRU2Zr637KkVdBoDdveGJZXR-IUAgdOIle8DXm432HSrViS8vJXJfZ9ac7atTCq7VOs6D8wkgO_Gdrr7CzQuua0OqGfJ39WgqP5UeNvkH6h1suk3KQD2ZqiW2PQ"
      }
    ]
  },
   {
    id: 'w2',
    tags: [BodyTarget.Legs, Mood.Tired, 'stretch'],
    title: "누워서 하는 하체 조각",
    duration: "15분",
    intensity: "Low",
    exercises: [
      {
        name: "라잉 레그 레이즈",
        reps: "12회",
        description: "평평하게 누워 무릎을 굽히지 않고 다리를 들어 올립니다.",
        image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=200"
      }
    ]
  }
];

export const getMockData = (lang: Language) => {
    if (lang === Language.KO) {
        return {
            recipes: MOCK_RECIPES_KO,
            outfits: MOCK_OUTFITS_KO,
            workouts: MOCK_WORKOUTS_KO
        }
    }
    return {
        recipes: MOCK_RECIPES_EN,
        outfits: MOCK_OUTFITS_EN,
        workouts: MOCK_WORKOUTS_EN
    }
}