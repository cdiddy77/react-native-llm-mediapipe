module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.json",
      "docsite/tsconfig.json",
      "examples/objectdetection/tsconfig.json",
    ],
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  ignorePatterns: [
    "scripts",
    "lib",
    "docs",
    "app.plugin.js",
    ".eslintrc.js",
    ".prettierrc.js",
    "*.config.js",
    "jest.setup.js",
    "coverage",
  ],
  plugins: ["@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "@react-native",
    "prettier",
  ],
  rules: {
    // eslint
    semi: "off",
    curly: ["error", "all"],
    "no-mixed-spaces-and-tabs": ["warn", "smart-tabs"],
    "no-async-promise-executor": "warn",
    "require-await": "warn",
    "no-return-await": "warn",
    "no-await-in-loop": "warn",
    "comma-dangle": "off", // prettier already detects this
    "no-restricted-syntax": [
      "error",
      {
        selector: "TSEnumDeclaration",
        message:
          "Enums have various disadvantages, use TypeScript's union types instead.",
      },
    ],
    // typescript
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: false,
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "off",
      {
        allowExpressions: true,
      },
    ],
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "prettier/prettier": "off",
    // react plugin
    "react/no-unescaped-entities": "off",
    // react native plugin
    "react-native/no-unused-styles": "warn",
    "react-native/split-platform-components": "off",
    "react-native/no-color-literals": "off",
    "react-native/no-raw-text": "off",
    "react-native/no-inline-styles": "off",
    "react-native/no-single-element-style-arrays": "warn",
    "@typescript-eslint/strict-boolean-expressions": [
      "error",
      {
        allowString: false,
        allowNullableObject: true,
        allowNumber: false,
        allowNullableBoolean: true,
      },
    ],
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-unnecessary-condition": "error",
    // docusaurus does that
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    // react hooks
    "react-hooks/exhaustive-deps": [
      "error",
      {
        additionalHooks:
          "(useDerivedValue|useAnimatedStyle|useAnimatedProps|useWorkletCallback|useFrameProcessor)",
      },
    ],
  },
  env: {
    node: true,
  },
  globals: {
    _log: "readonly",
  },
};
