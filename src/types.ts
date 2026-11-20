export type ProjectCategory =
  | 'IoT & ESP32'
  | 'Robotics'
  | 'Electronics'
  | 'Embedded Systems';

export interface ProjectComponent {
  name: string;
  role: string;
}

export interface ProjectStep {
  step: string;
  detail: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  year: string;
  status: string;
  shortDescription: string;
  thumbnailUrl: string;
  overview: string;
  problemStatement: string;
  objectives: string[];
  howItWorks: string;
  components: ProjectComponent[];
  developmentProcess: ProjectStep[];
  galleryImages: string[];
  videoUrl: string;
  resultsOutcomes: string;
  featuredOnLanding: boolean;
}

export type DocumentationType = 'photo' | 'youtube' | 'instagram';

export type DocumentationCategory =
  | 'Activity'
  | 'Workshop'
  | 'Event'
  | 'Development';

export interface DocumentationItem {
  id: string;
  title: string;
  type: DocumentationType;
  category: DocumentationCategory;
  date: string;
  description: string;
  imageUrl: string;
  externalUrl: string;
  featuredOnLanding: boolean;
}

export interface LandingPreviewPhoto {
  id: string;
  imageUrl: string;
  caption: string;
  categoryLabel: string;
}

export interface LandingDiscipline {
  index: string;
  title: string;
  description: string;
}

export interface LandingConfig {
  heroKicker: string;
  heroImageUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
  introSectionTitle: string;
  introSectionBody: string;
  disciplines: LandingDiscipline[];
  featuredProjectsTitle: string;
  featuredProjectsSubtitle: string;
  featuredDocsTitle: string;
  featuredDocsSubtitle: string;
  previewPhotos: LandingPreviewPhoto[];
  ctaKicker: string;
  ctaTitle: string;
  ctaBody: string;
}

export interface AboutPossibility {
  id: string;
  title: string;
  summary: string;
  focus: string;
  hardware: string;
}

export interface AboutRoadmapStage {
  stage: string;
  title: string;
  duration: string;
  summary: string;
  topics: string[];
}

export type OledPatternType = 'smiley' | 'wink' | 'robot' | 'heart' | 'wave';

export interface AboutOledScreen {
  label: string;
  pattern: OledPatternType;
}

export interface AboutWorkProgram {
  number: string;
  title: string;
  period: string;
  mentor: string;
  objectives: string;
  outcomes: string;
}

export interface AboutConfig {
  introTitle: string;
  introParagraph1: string;
  introParagraph2: string;
  charterPeriodLabel: string;
  organizationName: string;
  chairpersonName: string;
  coreFocus: string;
  primaryPlatform: string;
  footerDescription: string;
  possibilities: AboutPossibility[];
  roadmapStages: AboutRoadmapStage[];
  keychainTitle: string;
  keychainDescription: string;
  keychainProjectSlug: string;
  oledScreens: AboutOledScreen[];
  workPrograms: AboutWorkProgram[];
  workProgramPdfUrl: string;
}

export interface SiteContent {
  landing: LandingConfig;
  projects: ProjectItem[];
  documentation: DocumentationItem[];
  about: AboutConfig;
}
