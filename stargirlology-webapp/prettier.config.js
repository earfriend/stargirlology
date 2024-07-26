console.log("I AM IN THE PRETTIER CONFIG FILE");

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  experimentalTernaries: true,
  bracketSameLine: true,
  printWidth: 100,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
