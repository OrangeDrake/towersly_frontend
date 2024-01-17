// import adapter from '@sveltejs/adapter-auto';
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
//
//
// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	kit: {
// 		env:{
// 			dir: './'
// 		},
// 		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
// 		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
// 		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
// 		preprocess: [vitePreprocess()],
// 		adapter: adapter()
// 	}
// };
//
// export default config;

// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-auto';

export default {
	preprocess: [vitePreprocess()],
	adapter: adapter()
};