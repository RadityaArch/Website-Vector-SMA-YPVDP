import { ArrowRight, Pencil } from 'lucide-react';
import type { SiteContent } from '../types.ts';
import { formatDocCategory, formatProjectCategory } from '../utils/labels.ts';
import { SmartImage } from '../components/SmartImage.tsx';

interface HomePageProps {
  content: SiteContent;
  isEditor: boolean;
  onNavigate: (path: string) => void;
  onOpenEditor: (tab: 'landing' | 'projects' | 'documentation') => void;
}

export function HomePage({
  content,
  isEditor,
  onNavigate,
  onOpenEditor,
}: HomePageProps) {
  const { landing } = content;
  const featuredProjects = content.projects.filter((p) => p.featuredOnLanding);
  const displayedProjects =
    featuredProjects.length > 0 ? featuredProjects : content.projects.slice(0, 3);

  const featuredDocs = content.documentation.filter((d) => d.featuredOnLanding);
  const previewPhotos = landing.previewPhotos;

  return (
    <div className="space-y-20 pb-8">
      {/* Bagian Hero */}
      <section className="pt-8 sm:pt-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-6 flex flex-col justify-between py-2 space-y-6">
              <div className="space-y-4">
                <p className="font-serif italic text-sm tracking-wide text-[#1d4ed8]">
                  {landing.heroKicker}
                </p>
                <h1
                  className="font-bold tracking-tight text-[#0a1d37] leading-[1.12]"
                  style={{ fontSize: 'clamp(2.15rem, 3.8vw, 3.25rem)' }}
                >
                  {landing.heroHeadline}
                </h1>
                <p className="text-base text-[#456084] leading-relaxed max-w-xl">
                  {landing.heroSubheadline}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/projects"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/projects');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-[2px] text-sm font-semibold text-white btn-tactile whitespace-nowrap shrink-0"
                >
                  <span>Jelajahi Proyek</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/about');
                  }}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-[2px] text-sm font-semibold text-[#0a1d37] btn-tactile-secondary whitespace-nowrap shrink-0"
                >
                  Tentang VECTOR
                </a>
                {isEditor && (
                  <button
                    type="button"
                    onClick={() => onOpenEditor('landing')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-[2px] text-xs font-semibold text-[#1d4ed8] bg-[#ebf2fc] border border-[#c8d7ec] hover:bg-[#dce8f8] whitespace-nowrap shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    Edit Beranda
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-[3px] p-1.5 bezel-recessed">
                <div className="aspect-[16/9] w-full rounded-[2px] overflow-hidden bg-[#0a1d37] border border-[#1e3a8a]/30">
                  <SmartImage
                    src={landing.heroImageUrl}
                    alt="Visual utama laboratorium rekayasa dan robotika VECTOR"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pengenalan VECTOR & Bidang Inti */}
      <section className="border-y border-[#d4e1f3] bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a1d37]">
                {landing.introSectionTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#456084] leading-relaxed">
                {landing.introSectionBody}
              </p>
              <div className="pt-2">
                <a
                  href="/about#roadmap"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/about#roadmap');
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1d4ed8] hover:underline"
                >
                  <span>Lihat Peta Jalan Belajar 5 Tahap</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 border border-[#d4e1f3] rounded-[3px] overflow-hidden bg-[#f6f9fe]">
              {landing.disciplines.map((item, idx) => (
                <div
                  key={`${item.index}-${idx}`}
                  className={`p-6 bg-white space-y-2 ${
                    idx % 2 === 0 ? 'sm:border-r sm:border-[#d4e1f3]' : ''
                  } ${idx < 2 ? 'border-b border-[#d4e1f3]' : ''} ${
                    idx === 2 ? 'border-b sm:border-b-0 border-[#d4e1f3]' : ''
                  }`}
                >
                  <div className="font-serif text-sm font-bold text-[#1d4ed8] tabular-nums">
                    {item.index}.
                  </div>
                  <h3 className="text-base font-bold text-[#0a1d37]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#456084] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pratinjau Proyek Pilihan */}
      <section>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a1d37]">
                {landing.featuredProjectsTitle}
              </h2>
              <p className="text-sm text-[#456084] max-w-xl">
                {landing.featuredProjectsSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {isEditor && (
                <button
                  type="button"
                  onClick={() => onOpenEditor('landing')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] text-xs font-semibold text-[#1d4ed8] bg-[#ebf2fc] border border-[#c8d7ec] whitespace-nowrap shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                  Kelola Pilihan
                </button>
              )}
              <a
                href="/projects"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/projects');
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1d4ed8] hover:underline whitespace-nowrap shrink-0"
              >
                <span>Semua Proyek</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedProjects.map((project) => (
              <a
                key={project.id}
                href={`/projects/${project.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/projects/${project.slug}`);
                }}
                className="group surface-elevated rounded-[3px] overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
              >
                <div className="aspect-[4/3] bg-[#ebf2fc] border-b border-[#d4e1f3] overflow-hidden">
                  <SmartImage
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#5d7699]">
                      <span className="font-medium text-[#1d4ed8]">
                        {formatProjectCategory(project.category)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-serif tabular-nums">{project.year}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#0a1d37] group-hover:text-[#1d4ed8] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-[#456084] leading-relaxed line-clamp-3">
                      {project.shortDescription}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d4ed8]">
                    <span>Lihat Detail Proyek</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Pratinjau Aktivitas & Dokumentasi Terkini */}
      <section>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a1d37]">
                {landing.featuredDocsTitle}
              </h2>
              <p className="text-sm text-[#456084] max-w-xl">
                {landing.featuredDocsSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {isEditor && (
                <button
                  type="button"
                  onClick={() => onOpenEditor('landing')}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] text-xs font-semibold text-[#1d4ed8] bg-[#ebf2fc] border border-[#c8d7ec] whitespace-nowrap shrink-0"
                >
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                  Kelola Foto
                </button>
              )}
              <a
                href="/documentation"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/documentation');
                }}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1d4ed8] hover:underline whitespace-nowrap shrink-0"
              >
                <span>Buka Arsip</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {previewPhotos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {previewPhotos.map((photo) => (
                <figure
                  key={photo.id}
                  className="surface-elevated rounded-[3px] overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-[#ebf2fc] border-b border-[#d4e1f3] overflow-hidden">
                    <SmartImage
                      src={photo.imageUrl}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <figcaption className="p-4 space-y-1">
                    <div className="text-xs font-medium text-[#1d4ed8]">
                      {photo.categoryLabel}
                    </div>
                    <div className="text-sm font-semibold text-[#0a1d37]">
                      {photo.caption}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {featuredDocs.length > 0 && (
            <div className="border-t border-[#d4e1f3] pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredDocs.slice(0, 3).map((doc) => (
                <a
                  key={doc.id}
                  href="/documentation"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/documentation');
                  }}
                  className="p-4 rounded-[2px] bg-white border border-[#d4e1f3] hover:border-[#93b4e2] transition-colors space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-xs text-[#5d7699]">
                    <span className="font-medium text-[#1d4ed8]">
                      {formatDocCategory(doc.category)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-serif tabular-nums">{doc.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0a1d37]">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-[#456084] line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Jalur Menuju Tentang & Program Kerja 2027 */}
      <section>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="rounded-[3px] bg-gradient-to-br from-[#0a1d37] via-[#112c52] to-[#173b6d] text-white p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-[#1e3a8a]">
            <div className="lg:col-span-8 space-y-3">
              <p className="font-serif italic text-sm text-[#93c5fd]">
                {landing.ctaKicker}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {landing.ctaTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#cbdcf5] leading-relaxed max-w-2xl">
                {landing.ctaBody}
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/about');
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[2px] text-sm font-semibold text-[#0a1d37] bg-white hover:bg-[#ebf2fc] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Tentang VECTOR</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
