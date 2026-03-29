/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0D0D3B',
          800: '#12124F',
          700: '#1A1A6E',
          600: '#22228A',
        },
        brand: {
          red: '#CC0000',
          'red-dark': '#A30000',
          'red-light': '#FF1A1A',
        }
      },
    },
  },
  plugins: [],
}