import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import {
  clearEditorSessionCookie,
  isRequestAuthenticated,
  requireEditorAuth,
  setEditorSessionCookie,
  verifyAccessPin,
} from './server/auth.ts';
import {
  deleteDocumentationById,
  deleteProjectById,
  readSiteContent,
  saveUploadedImage,
  updateAboutConfig,
  updateLandingConfig,
  upsertDocumentation,
  upsertProject,
} from './server/store.ts';
import type {
  AboutConfig,
  DocumentationItem,
  LandingConfig,
  ProjectItem,
} from './src/types.ts';
import { createSlug } from './src/utils/media.ts';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));

  app.use('/api', (_req, res, next) => {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });
  app.use('/uploads', express.static(uploadsDir));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/content', (_req, res) => {
    const content = readSiteContent();
    res.json(content);
  });

  app.get('/api/auth/session', (req, res) => {
    res.json({ authenticated: isRequestAuthenticated(req) });
  });

  app.post('/api/auth/login', (req, res) => {
    const pin = typeof req.body?.pin === 'string' ? req.body.pin : '';
    if (!verifyAccessPin(pin)) {
      res.status(401).json({ error: 'Kode akses salah. Silakan coba lagi.' });
      return;
    }
    const token = setEditorSessionCookie(req, res);
    res.json({ authenticated: true, token });
  });

  app.post('/api/auth/logout', (req, res) => {
    clearEditorSessionCookie(req, res);
    res.json({ authenticated: false });
  });

  app.put('/api/content/landing', requireEditorAuth, (req, res) => {
    const body = req.body as Partial<LandingConfig> | undefined;
    if (
      !body ||
      typeof body.heroHeadline !== 'string' ||
      typeof body.heroSubheadline !== 'string' ||
      typeof body.heroImageUrl !== 'string' ||
      !Array.isArray(body.previewPhotos)
    ) {
      res.status(400).json({ error: 'Data halaman Beranda tidak valid.' });
      return;
    }
    const current = readSiteContent().landing;
    const content = updateLandingConfig({
      heroKicker:
        typeof body.heroKicker === 'string'
          ? body.heroKicker.trim()
          : current.heroKicker,
      heroImageUrl: body.heroImageUrl.trim(),
      heroHeadline: body.heroHeadline.trim(),
      heroSubheadline: body.heroSubheadline.trim(),
      introSectionTitle:
        typeof body.introSectionTitle === 'string'
          ? body.introSectionTitle.trim()
          : current.introSectionTitle,
      introSectionBody:
        typeof body.introSectionBody === 'string'
          ? body.introSectionBody.trim()
          : current.introSectionBody,
      disciplines: Array.isArray(body.disciplines)
        ? body.disciplines.map((d, idx) => ({
            index: String(d.index || String(idx + 1).padStart(2, '0')).trim(),
            title: String(d.title || '').trim(),
            description: String(d.description || '').trim(),
          }))
        : current.disciplines,
      featuredProjectsTitle:
        typeof body.featuredProjectsTitle === 'string'
          ? body.featuredProjectsTitle.trim()
          : current.featuredProjectsTitle,
      featuredProjectsSubtitle:
        typeof body.featuredProjectsSubtitle === 'string'
          ? body.featuredProjectsSubtitle.trim()
          : current.featuredProjectsSubtitle,
      featuredDocsTitle:
        typeof body.featuredDocsTitle === 'string'
          ? body.featuredDocsTitle.trim()
          : current.featuredDocsTitle,
      featuredDocsSubtitle:
        typeof body.featuredDocsSubtitle === 'string'
          ? body.featuredDocsSubtitle.trim()
          : current.featuredDocsSubtitle,
      previewPhotos: body.previewPhotos.map((photo) => ({
        id: String(photo.id || `lp-${Date.now()}`),
        imageUrl: String(photo.imageUrl || ''),
        caption: String(photo.caption || ''),
        categoryLabel: String(photo.categoryLabel || 'Aktivitas'),
      })),
      ctaKicker:
        typeof body.ctaKicker === 'string'
          ? body.ctaKicker.trim()
          : current.ctaKicker,
      ctaTitle:
        typeof body.ctaTitle === 'string'
          ? body.ctaTitle.trim()
          : current.ctaTitle,
      ctaBody:
        typeof body.ctaBody === 'string'
          ? body.ctaBody.trim()
          : current.ctaBody,
    });
    res.json({ content });
  });

  app.put('/api/content/about', requireEditorAuth, (req, res) => {
    const body = req.body as Partial<AboutConfig> | undefined;
    if (
      !body ||
      typeof body.introTitle !== 'string' ||
      !Array.isArray(body.possibilities) ||
      !Array.isArray(body.roadmapStages) ||
      !Array.isArray(body.oledScreens) ||
      !Array.isArray(body.workPrograms)
    ) {
      res.status(400).json({ error: 'Data halaman Tentang tidak valid.' });
      return;
    }
    const currentAbout = readSiteContent().about;
    const validPatterns = ['smiley', 'wink', 'robot', 'heart', 'wave'] as const;
    const content = updateAboutConfig({
      introTitle: body.introTitle.trim(),
      introParagraph1: String(body.introParagraph1 || '').trim(),
      introParagraph2: String(body.introParagraph2 || '').trim(),
      charterPeriodLabel: String(body.charterPeriodLabel || '').trim(),
      organizationName: String(body.organizationName || 'VECTOR').trim(),
      chairpersonName: String(body.chairpersonName || '').trim(),
      coreFocus: String(body.coreFocus || '').trim(),
      primaryPlatform: String(body.primaryPlatform || '').trim(),
      footerDescription:
        typeof body.footerDescription === 'string'
          ? body.footerDescription.trim()
          : currentAbout.footerDescription,
      possibilities: body.possibilities.map((item, idx) => ({
        id: String(item.id || `poss-${idx}-${Date.now()}`),
        title: String(item.title || '').trim(),
        summary: String(item.summary || '').trim(),
        focus: String(item.focus || '').trim(),
        hardware: String(item.hardware || '').trim(),
      })),
      roadmapStages: body.roadmapStages.map((stage, idx) => ({
        stage: String(stage.stage || String(idx + 1).padStart(2, '0')).trim(),
        title: String(stage.title || '').trim(),
        duration: String(stage.duration || '').trim(),
        summary: String(stage.summary || '').trim(),
        topics: Array.isArray(stage.topics)
          ? stage.topics.map((t) => String(t).trim()).filter(Boolean)
          : [],
      })),
      keychainTitle: String(body.keychainTitle || '').trim(),
      keychainDescription: String(body.keychainDescription || '').trim(),
      keychainProjectSlug: String(body.keychainProjectSlug || 'vector-identity-keychain').trim(),
      oledScreens: body.oledScreens.map((screen, idx) => ({
        label: String(screen.label || `Tampilan ${idx + 1}`).trim(),
        pattern: validPatterns.includes(screen.pattern)
          ? screen.pattern
          : validPatterns[idx % validPatterns.length],
      })),
      workPrograms: body.workPrograms.map((prog, idx) => ({
        number: String(prog.number || String(idx + 1).padStart(2, '0')).trim(),
        title: String(prog.title || '').trim(),
        period: String(prog.period || '').trim(),
        mentor: String(prog.mentor || '').trim(),
        objectives: String(prog.objectives || '').trim(),
        outcomes: String(prog.outcomes || '').trim(),
      })),
      workProgramPdfUrl: String(
        body.workProgramPdfUrl ||
          '/assets/aistudio/PROGRAM_KERJA_EKSTRAKURIKULER_VECTOR_PERIODE_2027_3091cc05.pdf'
      ).trim(),
    });
    res.json({ content });
  });

  app.post('/api/projects', requireEditorAuth, (req, res) => {
    const body = req.body as Partial<ProjectItem> | undefined;
    if (!body || !body.title?.trim() || !body.shortDescription?.trim()) {
      res.status(400).json({ error: 'Project title and short description are required.' });
      return;
    }
    const id = body.id?.trim() || `proj-${Date.now()}`;
    const slug = body.slug?.trim() || `${createSlug(body.title)}-${id.slice(-4)}`;
    const project: ProjectItem = {
      id,
      slug,
      title: body.title.trim(),
      category: body.category || 'IoT & ESP32',
      year: body.year?.trim() || '2027',
      status: body.status?.trim() || 'Prototype',
      shortDescription: body.shortDescription.trim(),
      thumbnailUrl: body.thumbnailUrl?.trim() || '/images/project-oled-keychain.svg',
      overview: body.overview?.trim() || body.shortDescription.trim(),
      problemStatement: body.problemStatement?.trim() || '',
      objectives: Array.isArray(body.objectives) ? body.objectives.filter(Boolean) : [],
      howItWorks: body.howItWorks?.trim() || '',
      components: Array.isArray(body.components) ? body.components : [],
      developmentProcess: Array.isArray(body.developmentProcess)
        ? body.developmentProcess
        : [],
      galleryImages: Array.isArray(body.galleryImages)
        ? body.galleryImages.filter(Boolean)
        : [],
      videoUrl: body.videoUrl?.trim() || '',
      resultsOutcomes: body.resultsOutcomes?.trim() || '',
      featuredOnLanding: Boolean(body.featuredOnLanding),
    };
    const content = upsertProject(project);
    res.status(201).json({ content, project });
  });

  app.put('/api/projects/:id', requireEditorAuth, (req, res) => {
    const { id } = req.params;
    const body = req.body as Partial<ProjectItem> | undefined;
    if (!body || !body.title?.trim() || !body.shortDescription?.trim()) {
      res.status(400).json({ error: 'Project title and short description are required.' });
      return;
    }
    const current = readSiteContent();
    const existing = current.projects.find((p) => p.id === id);
    if (!existing) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }
    const updated: ProjectItem = {
      ...existing,
      ...body,
      id: existing.id,
      slug: body.slug?.trim() || existing.slug,
      title: body.title.trim(),
      shortDescription: body.shortDescription.trim(),
    };
    const content = upsertProject(updated);
    res.json({ content, project: updated });
  });

  app.delete('/api/projects/:id', requireEditorAuth, (req, res) => {
    const { id } = req.params;
    const { content, deleted } = deleteProjectById(id);
    if (!deleted) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }
    res.json({ content });
  });

  app.post('/api/documentation', requireEditorAuth, (req, res) => {
    const body = req.body as Partial<DocumentationItem> | undefined;
    if (!body || !body.title?.trim()) {
      res.status(400).json({ error: 'Documentation title is required.' });
      return;
    }
    const item: DocumentationItem = {
      id: body.id?.trim() || `doc-${Date.now()}`,
      title: body.title.trim(),
      type: body.type || 'photo',
      category: body.category || 'Activity',
      date: body.date?.trim() || new Date().toISOString().slice(0, 10),
      description: body.description?.trim() || '',
      imageUrl: body.imageUrl?.trim() || '',
      externalUrl: body.externalUrl?.trim() || '',
      featuredOnLanding: Boolean(body.featuredOnLanding),
    };
    const content = upsertDocumentation(item);
    res.status(201).json({ content, item });
  });

  app.put('/api/documentation/:id', requireEditorAuth, (req, res) => {
    const { id } = req.params;
    const body = req.body as Partial<DocumentationItem> | undefined;
    if (!body || !body.title?.trim()) {
      res.status(400).json({ error: 'Documentation title is required.' });
      return;
    }
    const current = readSiteContent();
    const existing = current.documentation.find((d) => d.id === id);
    if (!existing) {
      res.status(404).json({ error: 'Documentation item not found.' });
      return;
    }
    const updated: DocumentationItem = {
      ...existing,
      ...body,
      id: existing.id,
      title: body.title.trim(),
    };
    const content = upsertDocumentation(updated);
    res.json({ content, item: updated });
  });

  app.delete('/api/documentation/:id', requireEditorAuth, (req, res) => {
    const { id } = req.params;
    const { content, deleted } = deleteDocumentationById(id);
    if (!deleted) {
      res.status(404).json({ error: 'Documentation item not found.' });
      return;
    }
    res.json({ content });
  });

  app.post('/api/upload', requireEditorAuth, (req, res) => {
    const dataUrl = typeof req.body?.dataUrl === 'string' ? req.body.dataUrl : '';
    const fileName = typeof req.body?.fileName === 'string' ? req.body.fileName : 'upload';
    try {
      const url = saveUploadedImage(dataUrl, fileName);
      res.status(201).json({ url });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Failed to upload image.',
      });
    }
  });

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VECTOR server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start VECTOR server:', err);
  process.exit(1);
});
