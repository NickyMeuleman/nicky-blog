import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      date: z.date(),
      draft: z.boolean().default(false),
      tags: z
        .enum([
          "algorithms",
          "JavaScript",
          "React",
          "Jamstack",
          "GraphQL",
          "CSS",
          "Rust",
          "DX",
          "how-to",
          "git",
          "GitHub",
          "WSL2",
          "GatsbyJS",
          "hardware",
          "serverless",
          "WebAssembly",
        ])
        .array()
        .default([]),
      canonicalUrl: z.string().url().optional(),
      series: z
        .enum(["Serverless GraphQL", "Fresh environment, 2018"])
        .optional(),
    }),
});

export const collections = { blog };
