import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSlug,
  extractYouTubeId,
  filterDocumentation,
  filterProjectsByCategory,
  getYouTubeEmbedUrl,
  isAllowedImageMime,
  isValidInstagramUrl,
} from './media.ts';
import type { DocumentationItem, ProjectItem } from '../types.ts';

test('extractYouTubeId handles watch, short, shorts, and embed URLs', () => {
  assert.equal(
    extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    'dQw4w9WgXcQ'
  );
  assert.equal(extractYouTubeId('https://youtu.be/abc123XYZ09'), 'abc123XYZ09');
  assert.equal(
    extractYouTubeId('https://www.youtube.com/shorts/short987654'),
    'short987654'
  );
  assert.equal(extractYouTubeId('https://example.com/watch?v=123456'), null);
  assert.equal(
    getYouTubeEmbedUrl('https://youtu.be/abc123XYZ09'),
    'https://www.youtube-nocookie.com/embed/abc123XYZ09'
  );
});

test('isValidInstagramUrl validates Instagram post and reel URLs', () => {
  assert.equal(isValidInstagramUrl('https://www.instagram.com/p/C8x123abc/'), true);
  assert.equal(isValidInstagramUrl('https://instagram.com/reel/C9xyz123/'), true);
  assert.equal(isValidInstagramUrl('https://vimeo.com/123456'), false);
  assert.equal(isValidInstagramUrl('not-a-url'), false);
});

test('createSlug generates clean URL-safe slugs', () => {
  assert.equal(
    createSlug('VECTOR Identity Keychain (0.96" OLED)'),
    'vector-identity-keychain-096-oled'
  );
  assert.equal(createSlug('   '), 'vector-item');
});

test('filterProjectsByCategory and filterDocumentation filter accurately', () => {
  const sampleProjects: ProjectItem[] = [
    {
      id: '1',
      slug: 'a',
      title: 'A',
      category: 'Robotics',
      year: '2027',
      status: 'Completed',
      shortDescription: 'Desc',
      thumbnailUrl: '/a.svg',
      overview: '',
      problemStatement: '',
      objectives: [],
      howItWorks: '',
      components: [],
      developmentProcess: [],
      galleryImages: [],
      videoUrl: '',
      resultsOutcomes: '',
      featuredOnLanding: true,
    },
    {
      id: '2',
      slug: 'b',
      title: 'B',
      category: 'IoT & ESP32',
      year: '2027',
      status: 'Prototype',
      shortDescription: 'Desc',
      thumbnailUrl: '/b.svg',
      overview: '',
      problemStatement: '',
      objectives: [],
      howItWorks: '',
      components: [],
      developmentProcess: [],
      galleryImages: [],
      videoUrl: '',
      resultsOutcomes: '',
      featuredOnLanding: false,
    },
  ];

  assert.equal(filterProjectsByCategory(sampleProjects, 'All').length, 2);
  assert.equal(filterProjectsByCategory(sampleProjects, 'Robotics').length, 1);

  const sampleDocs: DocumentationItem[] = [
    {
      id: 'd1',
      title: 'Workshop 1',
      type: 'photo',
      category: 'Workshop',
      date: '2027-01-15',
      description: 'Desc',
      imageUrl: '/w.svg',
      externalUrl: '',
      featuredOnLanding: true,
    },
    {
      id: 'd2',
      title: 'Demo Reel',
      type: 'youtube',
      category: 'Event',
      date: '2027-02-01',
      description: 'Video',
      imageUrl: '',
      externalUrl: 'https://youtu.be/abc123XYZ09',
      featuredOnLanding: true,
    },
  ];

  assert.equal(filterDocumentation(sampleDocs, 'All').length, 2);
  assert.equal(filterDocumentation(sampleDocs, 'Workshop').length, 1);
  assert.equal(filterDocumentation(sampleDocs, 'Videos').length, 1);
});

test('isAllowedImageMime accepts supported raster and SVG types only', () => {
  assert.equal(isAllowedImageMime('image/png'), true);
  assert.equal(isAllowedImageMime('image/jpeg'), true);
  assert.equal(isAllowedImageMime('image/webp'), true);
  assert.equal(isAllowedImageMime('application/pdf'), false);
});
