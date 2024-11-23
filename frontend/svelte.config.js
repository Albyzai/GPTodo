import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import adapter from "svelte-adapter-deno";
import path from "node:path";
const config = {
  preprocess: [vitePreprocess({})],
  kit: {
    adapter: adapter(),
    alias: {
      $lib: path.resolve('./src/lib'),
      $app: path.resolve('./node_modules/@sveltejs/kit/src/runtime/app')
      
    },
  },
};

export default config;
