/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'grey': {
          50: '#F6F7F9',
          100: '#EDEDF1',
          200: '#D7D9E0',
          300: "#B3B8C6",
          400: "#8A92A6",
          500: '#6B758C',
          800: '#414655',
          900: '#363944',
          950: "#24252D"
        },
        'blue': {
          50: "#EBF5FF",
          100: '#D6EBFF',
          200: '#B0D4FF',
          500: '#007BFF',
          600: '#0069D9',
          700: '#0056B3',
        },
        'brand': {
          green: '#1DBF73',
          'green-light': '#E8F8F0',
          'green-dark': '#17A863',
          blue: '#007BFF',
          'blue-light': '#EBF5FF',
          'blue-dark': '#0069D9',
        },
        green: {
          50: '#E8F8F0',
          100: '#D1F1E1',
          500: '#1DBF73',
          600: '#17A863',
        },
        error: "#FF2727"
      },
      screens: {
        '2xl': '1550px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.08)',
        'nav': '0 0 30px rgba(0,0,0,0.1)',
      }
    },

  },
  plugins: [],
}