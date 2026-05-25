import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Geist', 'Manrope', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        calm: '0 20px 70px rgba(31, 31, 28, 0.10)',
        lift: '0 10px 30px rgba(31, 31, 28, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config
