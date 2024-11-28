// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import expressiveCode from "astro-expressive-code";

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
  integrations: [
    react(),
    expressiveCode({ themes: ["night-owl"] }),
    mdx(),
    sitemap(),
    tailwind({
      // Disable the default styles as they are added with the @tailwind; css directives
      applyBaseStyles: false,
    }),
    icon(),
  ],
  vite: {
    worker: {
      // allow dynamic import in webworker: https://github.com/vitejs/vite/issues/18585
      format: "es",
    },
  },
});
