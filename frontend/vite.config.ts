import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
	  plugins: [sveltekit()],
	  resolve: {
		alias: {
		  $lib: path.resolve('./src/lib'),
		  $components: path.resolve('./src/lib'),
		  $utils: path.resolve('./src/lib/utils.ts'),
		  $shadcn: path.resolve('./src/lib/components/ui')
		},
		extensions: ['.js', '.ts', '.svelte']
	  },
	  define: {
		'process.env': env
	  }
	};
  });
