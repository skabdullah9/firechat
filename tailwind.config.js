const colors = require('tailwindcss/colors')
module.exports = {
  purge: {
    content: ['./public/**/*.html', './src/**/*.vue']
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        amber: colors.amber
      }
    },
    container: {
      center: true,

    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}