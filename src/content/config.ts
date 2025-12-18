import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      date: z.date(),
      updatedAt: z.date().optional(),
      draft: z.boolean().default(false),
      tags: z
        .enum([
          "Advent of Code",
          "CS",
          "CSS",
          "DX",
          "GatsbyJS",
          "GitHub",
          "GraphQL",
          "Jamstack",
          "JavaScript",
          "Python",
          "React",
          "Rust",
          "WSL2",
          "WebAssembly",
          "algorithms",
          "git",
          "hardware",
          "how-to",
          "serverless",
        ])
        .array()
        .default([]),
      canonicalUrl: z.string().url().optional(),
      series: z
        .enum([
          "Advent of Code 2015",
          "Advent of Code 2022",
          "Advent of Code 2023",
          "Advent of Code 2024",
          "Advent of Code 2025",
          "Fresh environment, 2018",
          "Serverless GraphQL",
          "Smart pointers in Rust",
        ])
        .optional(),
      section: z.enum(["blog", "garden"]).default("blog"),
    }),
});

export const collections = { blog };
