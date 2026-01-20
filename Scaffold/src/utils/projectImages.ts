// Shared helper for determining whether a project has associated images.
// Current convention: images live under /src/assets/book images/<ProjectTitle>/...
//
// Note: Vite deprecated `as: 'url'` in favor of `query: '?url', import: 'default'`.
const allImages = import.meta.glob('/src/assets/projects/**/*.{jpg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function numericSortKey(path: string): number {
  // Matches "(...)" numbering convention used in this repo, e.g. "Page (12).jpg"
  const match = path.match(/\((\d+)\)/);
  return match ? Number(match[1]) : 0;
}

export function getImageUrlsForTitle(projectTitle: string): string[] {
  if (!projectTitle) return [];

  return Object.entries(allImages)
    .filter(([path]) => path.includes(`/${projectTitle}/`))
    .sort(([a], [b]) => numericSortKey(a) - numericSortKey(b))
    .map(([, url]) => url);
}

export function hasImagesForTitle(projectTitle: string): boolean {
  return getImageUrlsForTitle(projectTitle).length > 0;
}

