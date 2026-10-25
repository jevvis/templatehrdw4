import type { Config } from 'tailwindcss'

// Design tokens (nilai yang sama dipakai di app/globals.css lewat variabel CSS)
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#060914',
        surface: '#0d1329',
        'surface-2': '#141b3a',
        primary: '#7c83ff',
        secondary: '#38bdf8',
        accent: '#2dd4bf',
        text: '#e8ebf8',
        'text-secondary': '#98a2c8',
        line: 'rgba(255,255,255,0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 60px -12px rgba(124,131,255,0.55)',
      },
    },
  },
  plugins: [],
}
export default config
