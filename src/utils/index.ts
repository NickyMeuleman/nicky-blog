import type { MarkdownHeading } from "astro";
import type { NestedHeading } from "./types";

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

function createNestedHeadings(headings: MarkdownHeading[]) {
  const startDepth = headings[0]?.depth ?? 1;
  const result: NestedHeading[] = [];
  const parents = new Map<number, NestedHeading>();

  for (const h of headings) {
    const heading: NestedHeading = { ...h, items: [] };
    if (heading.depth === startDepth) {
      result.push(heading);
    } else {
      parents.get(heading.depth - 1)?.items.push(heading);
    }
    parents.set(heading.depth, heading);
  }
  return result;
}

function scrollIfNeeded(element: HTMLElement, container: HTMLElement) {
  if (element.offsetTop < container.scrollTop) {
    container.scrollTop = element.offsetTop;
  } else {
    const offsetBottom = element.offsetTop + element.offsetHeight;
    const scrollBottom = container.scrollTop + container.offsetHeight;
    if (offsetBottom > scrollBottom) {
      container.scrollTop = offsetBottom - container.offsetHeight;
    }
  }
}

export { slugify, createNestedHeadings, scrollIfNeeded };
