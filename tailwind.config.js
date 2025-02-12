const flowbite = require('flowbite-react/tailwind');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/src/index.html', 
    './src/renderer/src/**/*.{js,ts,jsx,tsx}', 
    flowbite.content()
  ],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui'), flowbite.plugin()]
}
