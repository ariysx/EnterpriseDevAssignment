/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        greenAndLight: {
          primary: "#00BFA5", // Turquoise Green
          secondary: "#B2DFDB", // Light Turquoise Green
          accent: "#009688", // Darker Turquoise Green
          neutral: "#FAFAFA", // Light Grey for contrast
          "base-100": "#FFFFFF", // White background
        },
      },
    ],
  },
}
