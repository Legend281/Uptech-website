import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  {
    // Without these, `eslint .` walks build output and the Stitch reference
    // exports and reports thousands of problems in files nobody authors.
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "stitch_uptech_consulting_homepage_redesign/**",
      ".claude/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
