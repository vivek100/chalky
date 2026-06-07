export function docHref(slug: string) {
  return slug === "index" ? "/docs" : `/docs/${slug}`;
}
