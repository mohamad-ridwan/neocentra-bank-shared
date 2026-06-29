/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../neocentra-bank-dashboard/src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require('./tailwind.preset.js')],
  theme: {
    extend: {},
  },
  plugins: [],
}
