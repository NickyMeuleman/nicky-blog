// @ts-check

import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import icon from "astro-icon";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

// https://astro.build/config
export default defineConfig({
	site: "https://nickymeuleman.netlify.app",
	redirects: {
		"/garden/[slug]": "/blog/[slug]",
	},
	image: {
		service: {
			entrypoint: "astro/assets/services/sharp",
			config: {
				limitInputPixels: false,
			},
		},
	},
	markdown: {
		processor: unified({
			remarkPlugins: [remarkMath],
			rehypePlugins: [
				[
					rehypeKatex,
					{ strict: false, throwOnError: false, errorColor: "#feb2b2" },
				],
			],
		}),
	},
	integrations: [
		react(),
		expressiveCode({
			themes: ["night-owl"],
			plugins: [pluginLineNumbers()],
			defaultProps: { showLineNumbers: false },
		}),
		mdx(),
		sitemap(),
		// tailwind({
		//     // Disable the default styles as they are added with the @tailwind; css directives
		//     applyBaseStyles: false,
		// }),
		icon(),
	],
	vite: {
		worker: {
			// allow dynamic import in webworker: https://github.com/vitejs/vite/issues/18585
			format: "es",
		},
		plugins: [tailwindcss()],
	},
});
