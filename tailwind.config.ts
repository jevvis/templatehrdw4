import type { Config } from 'tailwindcss'

// Design tokens (nilai yang sama dipakai di app/globals.css lewat variabel CSS)
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a66c2',
        surface: '#0c5cb0',
        'surface-2': '#1275d6',
        primary: '#ffffff',
        secondary: '#dbeeff',
        accent: '#7ff0e4',
        'accent-soft': '#c4fff7',
        text: '#ffffff',
        'text-secondary': '#f7fbff',
        line: 'rgba(255,255,255,0.24)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 18px 50px -14px rgba(3,34,86,0.6)',
      },
    },
  },
  plugins: [],
}
export default config
