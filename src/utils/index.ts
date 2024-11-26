import type { MarkdownHeading } from "astro";
import type { HeadingData } from "./types";

function slugify(text: string): string {
  return encodeURIComponent(
    text
      .normalize("NFD") // Unicode break graphemes into combinations of simple ones
      .replace(/\p{Diacritic}/gu, "") // get rid of diacritics
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-"), // Replace multiple - with single -
  );
}

function createNestedHeadings(headings: MarkdownHeading[]): HeadingData[] {
  const result: HeadingData[] = [];
  const startDepth = headings[0]?.depth ?? 1;

  headings.forEach((heading) => {
    const prevDepth = result[result.length - 1]?.depth ?? startDepth;
    if (heading.depth === prevDepth || heading.depth < prevDepth) {
      result.push({ ...heading, items: [] });
    } else if (heading.depth === prevDepth + 1) {
      result[result.length - 1]?.items.push({ ...heading, items: [] });
    } else {
      console.error("You did something naughty, didn't you?");
    }
  });
  return result;
}

export { slugify, createNestedHeadings };
