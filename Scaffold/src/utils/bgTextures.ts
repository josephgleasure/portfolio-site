// Rotating background textures (used as a "mask fill" through the grey grid cells)
// Folder: /src/assets/BG Images/
//
// Vite note: we use query '?url' so the returned values are usable image URLs.
const textures = import.meta.glob('/src/assets/BG Images/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export const bgTextureUrls: string[] = Object.entries(textures)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);

