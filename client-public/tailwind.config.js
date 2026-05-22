/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F4C81",
        secondary: "#00A896",
        accent: "#F7C59F",
        danger: "#E63946",
        success: "#2DC653",
        warning: "#F4A261",
        surface: "#F8F9FC",
        card: "#FFFFFF",
        "dark-bg": "#0D1117",
        "dark-card": "#161B22"
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
