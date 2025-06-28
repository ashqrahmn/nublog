/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bangladesh-green": "#66825a",
        "light-green": "#f5ede0",
      },
      boxShadow: {
        green: '-7px 7px 0px #66825a',
        greenn: '-4px 4px 0px #66825a',
      },
    },
  },
  plugins: [],
};
