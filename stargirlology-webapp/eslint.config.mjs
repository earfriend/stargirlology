import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import stylistic from '@stylistic/eslint-plugin';

export default createConfigForNuxt({
}).append({
  files: ['**/*.ts', '**/*.vue'],
  plugins: {
    '@stylistic': stylistic
  },
  rules: {
    '@stylistic/indent': ['error', 2],
    "@stylistic/comma-dangle": ["error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "only-multiline",
        "exports": "never",
        "functions": "never"
    }],
    '@stylistic/quotes': ['error', 'single'],
    '@stylistic/block-spacing': ['error', 'always'],
    '@stylistic/semi': ['error', 'always'],
    'vue/html-self-closing': ['off'],
  }
});