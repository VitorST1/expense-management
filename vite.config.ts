import { paraglideVitePlugin } from "@inlang/paraglide-js"
import { defineConfig } from "vite-plus"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  optimizeDeps: {
    include: ["seroval"],
  },
  staged: {
    "!(**/_generated/**)/*.{js,ts,jsx,tsx,json}": [
      "vp lint --fix",
      "vp fmt --no-error-on-unmatched-pattern",
    ],
  },
  fmt: {
    semi: false,
    bracketSameLine: false,
    ignorePatterns: ["_generated", "src/routeTree.gen.ts"],
    experimentalTailwindcss: {
      stylesheet: "./src/styles.css",
      attributes: ["class", "className"],
      functions: ["clsx", "cn"],
      preserveDuplicates: false,
      preserveWhitespace: false,
    },
  },
  lint: {
    plugins: ["import", "typescript"],
    settings: {},
    rules: {
      eqeqeq: "warn",
      "import/no-cycle": "error",
      "eslint/no-unused-vars": "error",
      "default-case-last": "error",
      "default-param-last": "error",
      "prefer-template": "error",
      "unicorn/prefer-at": "error",
      "unicorn/no-useless-promise-resolve-reject": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  plugins: [
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      strategy: ["cookie", "preferredLanguage", "baseLocale"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
