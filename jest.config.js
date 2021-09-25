module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  collectCoverageFrom: ['./src/**/*.{ts,vue}', '!**/node_modules/**'],
  coverageReporters: ['text', 'text-summary']
};
