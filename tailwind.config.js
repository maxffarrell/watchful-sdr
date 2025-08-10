/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Geist Mono', 'monospace'],
      },
      colors: {
        'console-black': '#000000',
        'console-white': '#FFFFFF',
        'console-gray': '#A0A0A0',
      },
    },
  },
  plugins: [],
}