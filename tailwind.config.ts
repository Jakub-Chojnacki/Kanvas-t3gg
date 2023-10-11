import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        logoBlue: "#55c6ff",
        logoPurple: {
          100: "#584de2",
          200: "#4337de",
        },
        logoPurpleLight: "#9a71ff",
        logoGreen: "#24b57e",
        logoGreenLight: "#51e5a5",
        logoPink: "#E4759F",
      },
    },
  },
  corePlugins: { preflight: false },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
} satisfies Config;
