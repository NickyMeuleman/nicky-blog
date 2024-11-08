// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

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
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [
        rehypeKatex,
        { strict: false, throwOnError: false, errorColor: "#feb2b2" },
      ],
    ],
  },
  integrations: [react(), mdx(), sitemap(), tailwind(), icon()],
});
