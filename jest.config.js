/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],

  preset: "ts-jest",
  testPathIgnorePatterns: ["/node_modules/"],
  testRegex: ".test.(tsx?)$",
  transform: {
    "node_modules/(map-obj|camelcase|plur)/.+\\.(j|t)sx?$": "ts-jest",
  },
  transformIgnorePatterns: [
    `/node_modules/(?!.pnpm/)(?!(map-obj|camelcase|plur))`,
  ],

  verbose: true,
};
