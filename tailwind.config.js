/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f0fe',
          100: '#e3e3fc',
          200: '#cccefa',
          300: '#abacf5',
          400: '#8b92e8',
          500: '#5b5fde',
          600: '#4c50d1',
          700: '#4240be',
          800: '#38359a',
          900: '#32317a',
          950: '#1e1e47',
        },
        accent: {
          50: '#ecfffe',
          100: '#cffffe',
          200: '#a5fffe',
          300: '#67fffd',
          400: '#22f9f5',
          500: '#00d4aa',
          600: '#00b89c',
          700: '#00927f',
          800: '#067365',
          900: '#0a5f54',
          950: '#003a34',
        },
        success: '#00C48C',
        warning: '#FFB800',
        error: '#FF4747',
        info: '#0095FF',
        surface: '#FFFFFF',
        background: '#F8F9FB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}