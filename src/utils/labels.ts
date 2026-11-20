import type { DocumentationCategory, ProjectCategory } from '../types.ts';

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  'IoT & ESP32': 'IoT & ESP32',
  Robotics: 'Robotika',
  Electronics: 'Elektronika',
  'Embedded Systems': 'Sistem Tertanam',
};

export const DOC_CATEGORY_LABELS: Record<DocumentationCategory, string> = {
  Activity: 'Aktivitas',
  Workshop: 'Workshop',
  Event: 'Acara',
  Development: 'Pengembangan',
};

export function formatProjectCategory(category: ProjectCategory): string {
  return PROJECT_CATEGORY_LABELS[category] || category;
}

export function formatDocCategory(category: DocumentationCategory): string {
  return DOC_CATEGORY_LABELS[category] || category;
}
