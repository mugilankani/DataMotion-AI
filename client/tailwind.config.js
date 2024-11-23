/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        gradient: "gradient 3s linear infinite",
      },
      keyframes: {
        gradient: {
          "0%": {
            backgroundPosition: "200% 50%",
          },
          "100%": {
            backgroundPosition: "-200% 50%",
          },
        },
      },
      backgroundSize: {
        "200%": "200% auto",
      },
    },
  },
  plugins: [],
};
