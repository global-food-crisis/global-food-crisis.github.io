// basePath — resolves static asset URLs under the GitHub Pages project path.
//
// The site must work both at a domain root and under
// https://USERNAME.github.io/REPOSITORY_NAME/. Next.js handles code chunks
// through next.config `basePath`; runtime-fetched JSON data needs this helper.
// In CI, NEXT_PUBLIC_BASE_PATH is set to /REPOSITORY_NAME at build time.

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${clean}`;
}
