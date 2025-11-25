/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#0b0f19',
        muted: '#101826',
      },
      boxShadow: {
        soft: '0 10px 40px -18px rgba(0,0,0,0.45)',
      },
    },
  },
  plugins: [],
};
