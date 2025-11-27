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
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#0e76d9',
          700: '#0958a5',
          800: '#063d73',
          900: '#032347',
        },
        success: {
          50: '#e6f9f0',
          100: '#b3ecdc',
          200: '#80dfc7',
          300: '#4dd2b2',
          400: '#2bc59d',
          500: '#0db88a',
          600: '#0a9773',
          700: '#07765b',
          800: '#055543',
          900: '#02342b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'hover': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 15px 25px -3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
