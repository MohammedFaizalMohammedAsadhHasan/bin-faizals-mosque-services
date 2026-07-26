/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#021a19',
          900: '#042f2e',
          800: '#064e3b',
          700: '#0f766e',
          600: '#0d9488',
          500: '#14b8a6',
        },
        gold: {
          600: '#d97706',
          500: '#f59e0b',
          400: '#fbbf24',
          300: '#fcd34d',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        arabic: ['Readex Pro', 'Amiri', 'serif'],
      },
    },
  },
  plugins: [],
};
