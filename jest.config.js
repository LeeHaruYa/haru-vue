module.exports = {
  verbose: true,
  roots: ["<rootDir>/packages"], // 文件入口
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy", // 使用 identity-obj-proxy mock CSS Modules
  },
  testRegex: "(/test/.*|\\.(test|spec))\\.(ts|tsx|js)$", // 匹配测试文件
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "/node_modules/",
    "/lib/",
    "/demo/",
    "/dist/",
  ],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "\\.[jt]sx?$": "babel-jest", // 文件处理
    "^.+\\.svg$": "jest-svg-transformer", // svg转换
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  setupFiles: ["jest-canvas-mock"],
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!lodash-es)"], // transform编译忽略哪些文件
  collectCoverage: true, // 开启收集Coverage（测试覆盖范围）
  coverageDirectory: "<rootDir>/coverage/", // 指定生成的coverage目录
  coveragePathIgnorePatterns: ["<rootDir>/coverage/"], //该路径下的测试，忽略测试覆盖率
};
