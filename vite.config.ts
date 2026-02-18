import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 1. .env 파일 로드 (prefix 없이 모든 변수 로드)
  const env = loadEnv(mode, process.cwd(), '');

  // 2. 키 해석 (빌드 타임에 Node.js 측에서 처리)
  // Google: GOOGLE_API_KEY 또는 API_KEY (Google AI Studio 환경)
  const googleKey = env.GOOGLE_API_KEY || env.API_KEY || "";

  // OpenAI: OPENAI_API_KEY
  const openAiKey = env.OPENAI_API_KEY || "";

  console.log("------------------------------------------------");
  console.log("  [Vite Build] Injecting Keys");
  console.log(`  - __GOOGLE_KEY__ : ${googleKey ? "✅ Injected" : "❌ Empty (Check .env)"}`);
  console.log(`  - __OPENAI_KEY__ : ${openAiKey ? "✅ Injected" : "❌ Missing (Check .env)"}`);
  console.log("------------------------------------------------");

  return {
    plugins: [react()],
    define: {
      // 3. 전역 상수 정의 (클라이언트 코드에서 문자열 리터럴로 치환됨)
      __GOOGLE_KEY__: JSON.stringify(googleKey),
      // __OPENAI_KEY__: JSON.stringify(openAiKey), // REMOVED: Proxy 사용
      'process.env': env
    },
    build: {
      outDir: 'dist',
    },
    server: {
      host: true
    }
  };
});