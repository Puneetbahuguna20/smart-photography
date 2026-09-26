/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#FAB33C',
        'gold-light': '#FFD46A',
        'gold-dark': '#D99A1A',
        silver: '#B5B5B6',
        black: '#111111',
        white: '#FFFFFF',
        'dark-surface': '#1E1E1E',
        'text-secondary': '#D9D9D9',
        background: '#111111',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
