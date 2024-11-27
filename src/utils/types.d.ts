import type { MarkdownHeading } from "astro";

export interface NestedHeading extends MarkdownHeading {
  items: HeadingData[];
}
