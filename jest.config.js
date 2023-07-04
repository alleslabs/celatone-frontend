/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  verbose: true,
  preset: "ts-jest",

  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  transform: {
    "node_modules/(map-obj|camelcase)/.+\\.(j|t)sx?$": "ts-jest",
  },
  testPathIgnorePatterns: ["/node_modules/"],
  testRegex: ".test.(tsx?)$",

  transformIgnorePatterns: [`/node_modules/(?!(map-obj|camelcase))`],
};
