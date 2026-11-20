import type {
  DocumentationCategory,
  DocumentationItem,
  ProjectCategory,
  ProjectItem,
} from '../types.ts';

export function extractYouTubeId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{6,20}$/.test(id) ? id : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const vParam = parsed.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{6,20}$/.test(vParam)) {
        return vParam;
      }
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (
        parts.length >= 2 &&
        (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live')
      ) {
        const candidate = parts[1];
        return /^[a-zA-Z0-9_-]{6,20}$/.test(candidate) ? candidate : null;
      }
    }
  } catch {
    return null;
  }
  return null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

export function isValidInstagramUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    if (host !== 'instagram.com' && host !== 'instagr.am') {
      return false;
    }
    const parts = parsed.pathname.split('/').filter(Boolean);
    return parts.length >= 1;
  } catch {
    return false;
  }
}

export function createSlug(input: string): string {
  const normalized = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return normalized || 'vector-item';
}

export function filterProjectsByCategory(
  projects: ProjectItem[],
  category: 'All' | ProjectCategory
): ProjectItem[] {
  if (category === 'All') return projects;
  return projects.filter((project) => project.category === category);
}

export function filterDocumentation(
  items: DocumentationItem[],
  filter: 'All' | DocumentationCategory | 'Videos'
): DocumentationItem[] {
  if (filter === 'All') return items;
  if (filter === 'Videos') {
    return items.filter((item) => item.type === 'youtube' || item.type === 'instagram');
  }
  return items.filter((item) => item.category === filter);
}

export function isAllowedImageMime(mimeType: string): boolean {
  return [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml',
  ].includes(mimeType.toLowerCase());
}
