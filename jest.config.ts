import nextJest from "next/jest";

import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coveragePathIgnorePatterns: [
    "src/instrumentation.ts",
    "src/libs/database.ts",
    "src/types/MongoClient.ts",
  ],
};

const jestConfig = async () => ({
  ...(await createJestConfig(config)()),
  transformIgnorePatterns: [
    "/node_modules/(?!(d3|d3-.+|internmap|robust-predicates|delaunator)/)",
  ],
});

export default jestConfig;
