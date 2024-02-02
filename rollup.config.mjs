import terser from "@rollup/plugin-terser";

export default {
  input: "./src/index.js",
  output: [
    {
      file: "./build/all.min.js",
      format: "es",
      plugins: [terser()],
    },
    {
      file: "./build/all.js",
      format: "es",
    },
  ],
};
