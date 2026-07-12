/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  safelist: [
    // Add any dynamic classes here if needed based on JS loops
    {
      pattern: /bg-(red|green|blue|yellow)-(100|200|500|800)/,
    },
    {
      pattern: /text-(red|green|blue|yellow)-(500|800)/,
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
