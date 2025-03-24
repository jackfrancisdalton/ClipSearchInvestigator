  /** @type {import('tailwindcss').Config} */
  module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", './index.html'],
    theme: {
      extend: {
        colors: {
          primary: {
            50: "#E4FEF9",
            100: "#B9FCEB",
            200: "#8DFADD",
            300: "#60F7CF",
            400: "#3BF5C4",
            500: "#23F0C7",
            600: "#1DC9A7",
            700: "#179E84",
            800: "#117562",
            900: "#0B4D40",
          },
          background: {
            50: "#E7E9F2",
            100: "#C2C7DA",
            200: "#9CA4C1",
            300: "#7681A9",
            400: "#5A6594",
            500: "#141B2D",
            600: "#101527",
            700: "#0C1021",
            800: "#080B1B",
            900: "#040613",
          },
          white: {
            50: "#EDF0F8",
            100: "#D1D7E4",
            200: "#B5BDD0",
            300: "#99A4BC",
            400: "#7F8EA9",
            500: "#242C40",
            600: "#1F2638",
            700: "#1A2030",
            800: "#141A28",
            900: "#0F141F",
          },
        },
      },
    },
    plugins: [],
  }

