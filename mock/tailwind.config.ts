import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        moss: {
          ink: "#0f1410",
          muted: "#5f665f",
          line: "#e7e9e4",
          soft: "#f7f8f5",
          green: "#1f7a43",
          leaf: "#e8f6ea"
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        card: "0 18px 45px rgba(15, 20, 16, 0.06)"
      }
    }
  },
  plugins: [typography]
};

export default config;
