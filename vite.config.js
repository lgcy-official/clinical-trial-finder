import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'agentapply-coframe-project-id',
        transformIndexHtml(html) {
          return html.replace('__COFRAME_PROJECT_ID__', env.VITE_COFRAME_PROJECT_ID || '');
        },
      },
    ],
  };
})
