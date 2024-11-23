import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { loadEnv } from 'vite';
import path from 'node:path';
import process from 'node:process';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
	  plugins: [sveltekit()],
	  resolve: {
		alias: {
		  $lib: path.resolve('./src/lib'),
		  $app: path.resolve('./node_modules/@sveltejs/kit/src/runtime/app')
		},
	  },
	};
  });
