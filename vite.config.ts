import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Expose API Keys securely
      'process.env.API_KEY': JSON.stringify(env.API_KEY), // Default / Fallback
      'process.env.OPENAI_API_KEY': JSON.stringify(env.OPENAI_API_KEY), // Specific for OpenAI
      'process.env.GOOGLE_API_KEY': JSON.stringify(env.GOOGLE_API_KEY)  // Specific for Google
    },
    build: {
      outDir: 'dist',
    },
    server: {
      host: true
    }
  };
});