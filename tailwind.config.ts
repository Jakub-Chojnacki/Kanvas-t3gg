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
        dark: "#09090b",
        mantineDark: {
          0: "#C1C2C5",
          4: "#373A40",
        },
        mantineGray: {
          0: "#F8F9FA",
          4: "#CED4DA",
          8: "#343A40",
          9: "#212529",
        },
      },
    },
  },
  corePlugins: { preflight: false },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
} satisfies Config;
