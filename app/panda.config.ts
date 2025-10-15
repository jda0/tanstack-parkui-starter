import { defineConfig } from "@pandacss/dev";
import { plugin, preset } from "$/park-ui/preset";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Generates JSX utilities with options of React, Preact, Qwik, Solid, Vue
  jsxFramework: "react",

  // Whether to allow all style props, `css` only, or none.
  jsxStyleProps: "minimal",

  // Use the Park UI plugin (TODO: fix path when next CLI is stable)
  plugins: [plugin],

  // Use the Park UI preset (TODO: fix path when next CLI is stable)
  presets: [preset],

  // Set global css styles, such as the color palette
  globalCss: {
    extend: {
      html: { colorPalette: "neutral" },
    },
  },

  // Include all recipes from the css system
  staticCss: { recipes: "*" },

  // The output directory for your css system
  outdir: "lib/panda.gen",
});
