import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "/node_modules/(?!next-intl|use-intl|@formatjs).+\\.(js|jsx|mjs|cjs|ts|tsx)$",
  ],
};

export default createJestConfig(config);
