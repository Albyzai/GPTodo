//import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from 'svelte-adapter-deno'
/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess({})],
	kit: {
		adapter: adapter(),
		alias: {
			$lib: 'src/lib',
			$utils: 'src/lib/utils',
			$shadcn: 'src/lib/components/ui',
			$components: 'src/components'
		}
	}
};

export default config;
