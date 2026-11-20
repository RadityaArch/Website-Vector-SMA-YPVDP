import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type {
  AboutConfig,
  DocumentationItem,
  LandingConfig,
  ProjectItem,
  SiteContent,
} from '../src/types.ts';
import { DEFAULT_SITE_CONTENT, normalizeSiteContent } from '../src/utils/content.ts';

const SRC_DATA_DIR = path.resolve(process.cwd(), 'src', 'data');
const SRC_CONTENT_FILE = path.join(SRC_DATA_DIR, 'site-content.json');
const DATA_DIR = path.resolve(process.cwd(), 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
const DIST_UPLOADS_DIR = path.resolve(process.cwd(), 'dist', 'uploads');

function ensureDirectories(): void {
  fs.mkdirSync(SRC_DATA_DIR, { recursive: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export function readSiteContent(): SiteContent {
  ensureDirectories();
  const candidates = [SRC_CONTENT_FILE, CONTENT_FILE];
  let bestContent: SiteContent | null = null;
  let newestMtime = -1;

  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;
    try {
      const stat = fs.statSync(filePath);
      if (stat.mtimeMs > newestMtime) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw) as Partial<SiteContent>;
        bestContent = normalizeSiteContent(parsed);
        newestMtime = stat.mtimeMs;
      }
    } catch {
      // Skip malformed candidate file
    }
  }

  if (!bestContent) {
    const initial = structuredClone(DEFAULT_SITE_CONTENT);
    writeSiteContent(initial);
    return initial;
  }

  // Keep both source-tree and runtime JSON files synchronized
  if (!fs.existsSync(SRC_CONTENT_FILE) || !fs.existsSync(CONTENT_FILE)) {
    writeSiteContent(bestContent);
  }
  return bestContent;
}

export function writeSiteContent(content: SiteContent): SiteContent {
  ensureDirectories();
  const normalized = normalizeSiteContent(content);
  const serialized = JSON.stringify(normalized, null, 2);
  fs.writeFileSync(SRC_CONTENT_FILE, serialized, 'utf8');
  fs.writeFileSync(CONTENT_FILE, serialized, 'utf8');
  return normalized;
}

export function updateLandingConfig(landing: LandingConfig): SiteContent {
  const current = readSiteContent();
  current.landing = landing;
  return writeSiteContent(current);
}

export function updateAboutConfig(about: AboutConfig): SiteContent {
  const current = readSiteContent();
  current.about = about;
  return writeSiteContent(current);
}

export function upsertProject(project: ProjectItem): SiteContent {
  const current = readSiteContent();
  const idx = current.projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) {
    current.projects[idx] = project;
  } else {
    current.projects.unshift(project);
  }
  return writeSiteContent(current);
}

export function deleteProjectById(id: string): { content: SiteContent; deleted: boolean } {
  const current = readSiteContent();
  const next = current.projects.filter((p) => p.id !== id);
  const deleted = next.length !== current.projects.length;
  current.projects = next;
  return { content: writeSiteContent(current), deleted };
}

export function upsertDocumentation(item: DocumentationItem): SiteContent {
  const current = readSiteContent();
  const idx = current.documentation.findIndex((d) => d.id === item.id);
  if (idx >= 0) {
    current.documentation[idx] = item;
  } else {
    current.documentation.unshift(item);
  }
  return writeSiteContent(current);
}

export function deleteDocumentationById(id: string): {
  content: SiteContent;
  deleted: boolean;
} {
  const current = readSiteContent();
  const next = current.documentation.filter((d) => d.id !== id);
  const deleted = next.length !== current.documentation.length;
  current.documentation = next;
  return { content: writeSiteContent(current), deleted };
}

const MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
};

export function saveUploadedImage(dataUrl: string, originalName = 'upload'): string {
  ensureDirectories();
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/.exec(
    dataUrl.trim()
  );
  if (!match) {
    throw new Error('Format data gambar tidak valid.');
  }
  const mimeType = match[1].toLowerCase();
  const ext = MIME_TO_EXT[mimeType];
  if (!ext) {
    throw new Error('Format gambar tidak didukung. Gunakan PNG, JPG, WebP, atau SVG.');
  }
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length === 0 || buffer.length > 5 * 1024 * 1024) {
    throw new Error('Ukuran gambar harus di bawah 5 MB.');
  }
  const safeBase =
    originalName
      .toLowerCase()
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-z0-9-_]/g, '-')
      .slice(0, 32) || 'asset';
  const filename = `${safeBase}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${ext}`;
  const fullPath = path.join(UPLOADS_DIR, filename);
  fs.writeFileSync(fullPath, buffer);

  if (fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
    fs.mkdirSync(DIST_UPLOADS_DIR, { recursive: true });
    fs.writeFileSync(path.join(DIST_UPLOADS_DIR, filename), buffer);
  }
  return `/uploads/${filename}`;
}
