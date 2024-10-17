/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'mccd-gold': 'rgba(232, 181, 56, 1)',
        'mccd-blue': 'rgba(0, 41, 118, 1)',
        'mccd-blue-light': 'rgba(0, 41, 125, 1)',
        'mccd-gold-dark': 'rgba(232, 181, 75, 1)',
      },
      backgroundImage: {
        'mccd-blue-to-gold': 'linear-gradient(to right, rgba(0, 41, 118, 1), rgba(232, 181, 56, 1))',
        'mccd-gold-to-blue': 'linear-gradient(to left, rgba(0, 41, 118, 1), rgba(232, 181, 56, 1))',
      },

    },
  plugins: [
    require('tailwind-scrollbar'),
  ],
  }
}