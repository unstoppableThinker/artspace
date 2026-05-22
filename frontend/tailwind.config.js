/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:  ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#111111',
          soft:    '#525252',
          muted:   '#737373',
          faint:   '#a3a3a3',
        },
      },
      borderColor: {
        DEFAULT: '#e5e5e5',
        strong:  '#d4d4d4',
      },
    },
  },
  plugins: [],
};

