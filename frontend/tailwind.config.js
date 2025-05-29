  /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", './index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#23F0C7",
          medium: "#1DC9A7",
          dark: "#179E84",
          darker: "#117562",
        },
        background: {
          light: "#141B2D",
          medium: "#101527",
          dark: "#0C1021",
          darker: "#080B1B",
        },
        white: {
          DEFAULT: "#EDF0F8",
          medium: "#D1D7E4",
          dark: "#1A2030",
        },
      },
    },
  },
  plugins: [],
}

