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

export { slugify };
