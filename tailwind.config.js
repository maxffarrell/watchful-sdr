/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Geist Mono", "monospace"],
      },
      colors: {
        "console-dark": "rgb(32, 49, 44)", // 20% darker
        "console-light": "rgb(188, 215, 82)",
        "console-gray": "rgb(120, 145, 75)",
        "console-darker": "rgb(32, 49, 44)", // Even darker for panels
      },
    },
  },
  plugins: [],
};
