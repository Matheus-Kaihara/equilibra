import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Prefer explicit override via env; otherwise infer from GitHub repository name.
  // Examples:
  // - usuario.github.io -> '/'
  // - equilibra -> '/equilibra/'
  const repositoryName = env.VITE_GITHUB_PAGES_REPOSITORY ?? env.GITHUB_REPOSITORY?.split('/')[1]
  const isUserOrOrgPagesRepo = repositoryName?.endsWith('.github.io')
  const base = isUserOrOrgPagesRepo ? '/' : repositoryName ? `/${repositoryName}/` : '/'

  return {
    base,
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
