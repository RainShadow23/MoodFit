# Project Status: Fit & Mood

## 1. Feature Status Table
| 상태 | 기능명 | 관련 파일 | 개발 의도 (Rationale) |
|:---:|:---:|:---:|:---|
| ✅ | **대시보드 (홈)** | `Dashboard.tsx` | 사용자의 기분, 날씨, MBTI를 기반으로 한 직관적인 요약 화면 제공. |
| ✅ | **기분 선택기** | `Dashboard.tsx` | 사용자의 감정 상태를 입력받아 추천 알고리즘의 변수로 활용. |
| ✅ | **개인화 진행률** | `Dashboard.tsx` | 프로필 완성 유도를 위한 게이미피케이션 요소. |
| ✅ | **추천 엔진 (하이브리드)** | `services/engine.ts` | 로컬 데이터 우선 사용 후, 필요시 Gemini API로 확장하는 비용 효율적 구조. |
| ✅ | **식단 상세 (Diet)** | `DietRecipe.tsx` | 레시피 정보, 영양 성분, 조리 순서 제공. (AI 냉장고 파먹기 진입점 포함) |
| ✅ | **스타일/운동 상세** | `StyleWorkout.tsx` | 체형별 코디 제안 및 타겟 부위 운동 가이드 제공. |
| ✅ | **프로필 설정 v4.6** | `ProfileSetup.tsx` | **이미지 링크 전면 복구**: 사용자가 검증한 LH3(러시안 트위스트)와 프로젝트 내 검증된 Unsplash(레그 레이즈) 이미지로 고정. |
| ✅ | **하단 내비게이션** | `BottomNav.tsx` | 주요 탭(홈, 옷장, 식단, 프로필) 간의 빠른 이동 지원. |
| ✅ | **다국어 지원 (Localization)** | `i18n.ts`, `constants.ts` | 한국어/영어 전환 기능 및 데이터 분리, AI 프롬프트 제어. |
| ✅ | **리포트 다운로드 v5.1** | `StyleWorkout.tsx` | **HTML 리포트 생성**: 고화질 원본 이미지가 포함된 분석 리포트를 `.html` 파일로 다운로드 제공. |
| ✅ | **AI 저장소 최적화 v5.1** | `services/geminiService.ts`, `App.tsx` | **RAM/Disk 분리**: 화면엔 고화질(RAM) 유지, 저장소엔 압축본(Disk) 저장. 사용자는 생성 직후 원본 화질로 리포트 소장 가능. |
| ✅ | **AI 냉장고 파먹기 v5.2** | `DietRecipe.tsx`, `App.tsx` | **Feature Complete**: '냉장고 파먹기' 배너를 실제 기능으로 연결. 재료 입력 모달 및 단일 레시피 생성 AI 파이프라인 구축. |
| ✅ | **API 초기화 수정 v5.3** | `services/geminiService.ts` | **Critical Fix**: 모듈 로드 시점이 아닌 함수 호출 시점에 `process.env.API_KEY`를 로드하도록 변경하여 '빈 키 요청' 문제 해결. |
| ✅ | **AI UX/UI 긴급 수정 v5.4** | `App.tsx`, `DietRecipe.tsx` | **Logic Fix**: AI 기본값을 True로 변경하여 최초 실행 시 AI가 동작하도록 수정. 냉장고 파먹기 배너의 조건부 렌더링 제거하여 상시 노출. |
| ✅ | **리포트 핫픽스 v5.5** | `StyleWorkout.tsx` | **HTML Content Fix**: 다운로드된 리포트에 누락되었던 **조리 순서(Preparation Steps)** 섹션 추가. |

## 2. Tech Stack & Rules
### Tech Stack
- **Core:** React 18+ (Hooks 기반 함수형 컴포넌트)
- **Styling:** Tailwind CSS (다크모드 지원, `font-display` 등 커스텀 설정)
- **AI:** Google GenAI SDK (`@google/genai`) 
    - Text: `gemini-3-flash-preview`
    - Image: `gemini-2.5-flash-image` (Generates High-Quality PNG)
- **Optimization:** Canvas API for Background Image Compression (PNG -> JPEG 0.5)
- **Storage:** LocalStorage (Single Key: `luvitt_latest_ai_data` - Compressed)
- **Icons:** Material Icons Round, Material Symbols Outlined
- **Build:** Vite (ESM)
- **Localization:** Custom Dictionary Pattern (`i18n.ts`)

### Coding Rules
- **SSOT:** 상태 관리는 가능한 상위(`App.tsx`)에서 수행하고 Props로 전달한다.
- **Fail-safe:** AI 응답 실패 시 반드시 로컬 Mock 데이터를 폴백(Fallback)으로 사용하거나 안전한 기본값을 제공해야 한다.
- **Performance:** 이미지 로딩 시 `aspect-ratio`나 고정 높이를 사용하여 레이아웃 시프트를 방지한다.
- **Aesthetics:** 모바일 퍼스트 디자인, 여백(Spacing)과 타이포그래피 계층 구조를 엄격히 준수한다.

## 3. Current Todo
- [ ] **칼로리 트래커 구현:** 현재 정적인 데이터로 표시되는 '잔여 칼로리' 등을 실제 기록 기능과 연동.
- [ ] **운동 타이머:** 운동 가이드 화면에 실제 카운트다운 타이머 기능 추가.

## 4. Change Log
| 날짜 | 변경 내용 | 이유 (Why) | 변경 파일 | 승인여부 |
|:---:|:---|:---|:---:|:---:|
| 2024-05-22 | **프로젝트 상태 문서 생성** | 개발 규칙 준수 및 히스토리 관리 시작 | `PROJECT_STATUS.md` | ✅ Yes |
| 2024-05-22 | **대시보드 이미지 사이즈 수정** | 음식 이미지가 너무 커서 UI 밸런스 붕괴 방지 (`h-48` 적용) | `Dashboard.tsx` | ✅ Yes |
| 2024-05-22 | **개인화 진행률 카드 추가** | 사용자의 프로필 완성 유도 (기획서 반영) | `Dashboard.tsx`, `App.tsx` | ✅ Yes |
| 2024-05-22 | **Gemini API 안전성 확보** | AI 응답 누락 시 앱 크래시 방지 (Null Check) | `services/geminiService.ts` | ✅ Yes |
| 2024-05-22 | **프로필 UI 전면 개편** | 기획 의도(정밀 개인화) 반영을 위한 데이터 필드(성별, 골격) 추가 및 비주얼 업그레이드 | `types.ts`, `App.tsx`, `ProfileSetup.tsx`, `PROJECT_STATUS.md` | ✅ Yes |
| 2024-05-22 | **하단 내비게이션 링크 수정** | Profile 클릭 시 빈 화면 오류 수정, FAB 버튼을 Home으로 매핑하여 흐름 개선 | `App.tsx`, `components/BottomNav.tsx` | ✅ Yes |
| 2024-05-22 | **다국어(KR/EN) 시스템 도입** | UI 딕셔너리 구축, 데이터 분리, AI 프롬프트 제어를 통한 전사적 로컬라이제이션 | `전체 파일` | ✅ Yes |
| 2024-05-22 | **프로필 설정 v2.0~v2.9** | UI 개선 및 이미지 매칭 시도했으나 반복적인 Stock Photo 매칭 오류 발생 | `ProfileSetup.tsx` | ❌ No |
| 2024-05-22 | **프로필 설정 v3.0** | 내부 에셋 사용 시도했으나, 기존에 잘 작동하던 하체 이미지까지 변경되어 사용자 불만족 | `ProfileSetup.tsx` | ❌ No |
| 2024-05-22 | **프로필 설정 v4.0 (GenAI Integration)** | 하체 이미지는 검증된 버전(`ec10de...`)으로 롤백하고, **Gemini AI 이미지 생성 기능**을 탑재하여 사용자가 직접 이미지를 생성(커스텀)할 수 있도록 구조 혁신 | `ProfileSetup.tsx`, `PROJECT_STATUS.md` | ✅ Yes |
| 2024-05-22 | **프로필 설정 v4.1 (Stability Fix)** | 하체 이미지는 검증된 'Squat'(`1cddd...`)으로, 복부는 내부 'Russian Twist'(`lh3`)로 교체하여 오류 완전 해결 | `ProfileSetup.tsx`, `PROJECT_STATUS.md` | ✅ Yes |
| 2024-05-22 | **프로필 설정 v4.2 (State Decoupling)** | 기본 이미지를 `useState`에서 분리하여 `DEFAULT_IMAGES` 상수로 관리. HMR/State Caching으로 인한 이미지 고착 문제 영구 해결 | `ProfileSetup.tsx`, `PROJECT_STATUS.md` | ✅ Yes |
| 2024-05-22 | **프로필 설정 v4.3 (Asset Renewal)** | 모든 기본 이미지를 새로운 Unsplash ID(검증됨)로 전면 교체. 하체 이미지 깨짐 현상 및 시각적 반복 문제 최종 해결 | `ProfileSetup.tsx`, `PROJECT_STATUS.md` | ✅ Yes |
| 2024-05-22 | **프로필 설정 v4.4 (State Bypass & LH3)** | `useState`를 완전히 배제하고 상수를 직접 참조하여 변경사항 즉시 반영. 복부는 LH3 링크 사용, 하체는 새 ID에 cache-busting 적용. | `ProfileSetup.tsx`, `PROJECT_STATUS.md` | ✅ Yes |
| 2024-05-22 | **프로필 설정 v4.5 (Asset Attempt)** | 이미지 변경 시도했으나 시각적 모호함으로 롤백. | `ProfileSetup.tsx`, `PROJECT_STATUS.md` | ❌ No |
| 2024-05-22 | **프로필 설정 v4.6 (Final Restoration)** | **복부:** 사용자 검증 완료된 LH3(Russian Twist) 복구. **하체:** 프로젝트 Mock Data에서 검증된 Unsplash(Leg Raises) ID 사용. | `ProfileSetup.tsx`, `PROJECT_STATUS.md` | ✅ Yes |
| 2024-05-22 | **AI 라이프스타일 생성 v4.7** | **텍스트(JSON) & 이미지 동시 생성**: Refresh 버튼 클릭 시 Gemini 3로 코디/식단 텍스트를 만들고, 이를 Gemini 2.5 Image 모델로 시각화하여 완전한 맞춤형 콘텐츠 제공. | `services/geminiService.ts`, `StyleWorkout.tsx`, `App.tsx` | ✅ Yes |
| 2024-05-22 | **AI 서비스 안정화 v4.8** | **JSON Parsing Fix**: 응답 마크다운 제거 로직 추가. JSON 파싱 실패 시 폴백 방지 강화. | `services/geminiService.ts` | ✅ Yes |
| 2024-05-22 | **AI 영속성 및 품질 v4.9** | **Persistence**: `localStorage` 캐싱으로 데이터 휘발 방지. **Quality**: 프롬프트 강화로 상세한 스타일링/조리법 제공. | `App.tsx`, `services/geminiService.ts` | ✅ Yes |
| 2024-05-22 | **AI 저장소 최적화 v5.0** | **압축 & 단일 슬롯**: 1) 옵션 변경 시 리셋 방지(Single Slot). 2) Base64 이미지를 캔버스에서 JPEG 압축하여 저장 용량 확보. | `App.tsx`, `services/geminiService.ts` | ✅ Yes |
| 2024-05-22 | **리포트 다운로드 v5.1** | **Report & Decoupling**: 1) `StyleWorkout.tsx`에 HTML 리포트 다운로드 버튼 추가. 2) 화면용 고화질(State)과 저장용 저화질(LocalStorage) 로직 분리. | `StyleWorkout.tsx`, `App.tsx`, `services/geminiService.ts` | ✅ Yes |
| 2024-05-22 | **AI 냉장고 파먹기 v5.2** | **Feature Complete**: '냉장고 파먹기' 배너 클릭 시 재료 입력 모달 제공. Gemini API로 맞춤형 레시피 생성 및 연동. | `DietRecipe.tsx`, `App.tsx`, `services/geminiService.ts` | ✅ Yes |
| 2024-05-22 | **API 초기화 수정 v5.3** | **Critical Bug Fix**: 모듈 스코프의 AI 인스턴스 제거. API 호출 시마다 `process.env.API_KEY`를 새로 읽어 클라이언트를 초기화하도록 수정. | `services/geminiService.ts` | ✅ Yes |
| 2024-05-22 | **AI UX/UI 긴급 수정 v5.4** | **Logic Fix**: AI 기본값을 True로 변경. 냉장고 파먹기 배너 상시 노출. | `App.tsx`, `DietRecipe.tsx` | ✅ Yes |
| 2024-05-22 | **리포트 핫픽스 v5.5** | **HTML Content Fix**: 리포트 내 레시피 조리 순서(Steps) 누락 문제 해결. | `StyleWorkout.tsx` | ✅ Yes |
