export const tsup = {
  splitting: true,
  clean: true, // clean up the dist folder
  dts: false, // generate dts files
  format: ["cjs"], // generate cjs and esm files , "esm"
  minify: true,
  bundle: true,
  skipNodeModulesBundle: false,
  entryPoints: ["src/index.js"],
  watch: false,
  outDir: "dist",
  entry: ["./**/*.js"], //include all files under src
};
