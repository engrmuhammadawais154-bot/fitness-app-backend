/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'sm': '360px',
        'md': '480px',
        'lg': '640px',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['clamp(0.875rem, 2.5vw, 1rem)', { lineHeight: '1.5rem' }],
        'lg': ['clamp(1rem, 2.5vw, 1.125rem)', { lineHeight: '1.75rem' }],
        'xl': ['clamp(1.125rem, 3vw, 1.25rem)', { lineHeight: '1.75rem' }],
        '2xl': ['clamp(1.25rem, 3.5vw, 1.5rem)', { lineHeight: '2rem' }],
        '3xl': ['clamp(1.5rem, 4vw, 1.875rem)', { lineHeight: '2.25rem' }],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [],
}
