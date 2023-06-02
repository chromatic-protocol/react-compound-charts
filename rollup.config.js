import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import pkg from "./package.json";

export default [
  {
    input: "src/lib/index.ts",
    output: [
      { file: pkg.main, format: "cjs", sourcemap: true, exports: "named" },
      { file: pkg.module, format: "esm", sourcemap: true, exports: "named" },
    ],
    plugins: [
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: [
          "@babel/preset-env",
          "@babel/preset-react",
          "@babel/preset-typescript",
        ],
      }),
      resolve(),
      commonjs(),
      terser(),
      postcss(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
    ],
    external: Object.keys(pkg.peerDependencies),
    eslintConfig: {
      parser: "babel-eslint",
    },
  },
];
