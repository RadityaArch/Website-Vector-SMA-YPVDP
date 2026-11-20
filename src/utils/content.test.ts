import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SITE_CONTENT, normalizeSiteContent } from './content.ts';

test('normalizeSiteContent fills missing landing and about fields without losing user edits', () => {
  const partial = {
    landing: {
      heroHeadline: 'Judul Baru Kustom',
      heroSubheadline: 'Subjudul kustom.',
      heroImageUrl: '/uploads/custom.png',
      previewPhotos: [],
    },
    about: {
      chairpersonName: 'Pengurus Baru',
      oledScreens: [{ label: 'Layar 1' } as unknown as { label: string; pattern: 'smiley' }],
    },
  } as unknown as Parameters<typeof normalizeSiteContent>[0];

  const normalized = normalizeSiteContent(partial);
  assert.equal(normalized.landing.heroHeadline, 'Judul Baru Kustom');
  assert.equal(normalized.landing.disciplines.length, 4);
  assert.equal(
    normalized.landing.introSectionTitle,
    DEFAULT_SITE_CONTENT.landing.introSectionTitle
  );
  assert.equal(normalized.about.chairpersonName, 'Pengurus Baru');
  assert.equal(normalized.about.oledScreens[0].pattern, 'smiley');
  assert.equal(normalized.projects.length, DEFAULT_SITE_CONTENT.projects.length);
});
