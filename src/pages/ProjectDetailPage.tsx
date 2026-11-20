import { ArrowLeft, Pencil } from 'lucide-react';
import type { ProjectItem } from '../types.ts';
import { formatProjectCategory } from '../utils/labels.ts';
import { getYouTubeEmbedUrl } from '../utils/media.ts';
import { SmartImage } from '../components/SmartImage.tsx';

interface ProjectDetailPageProps {
  project: ProjectItem | undefined;
  isEditor: boolean;
  onNavigate: (path: string) => void;
  onOpenEditor: (tab: 'projects') => void;
}

export function ProjectDetailPage({
  project,
  isEditor,
  onNavigate,
  onOpenEditor,
}: ProjectDetailPageProps) {
  if (!project) {
    return (
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#0a1d37]">
          Proyek Tidak Ditemukan
        </h1>
        <p className="text-sm text-[#456084]">
          Proyek yang diminta tidak ditemukan atau mungkin telah dihapus.
        </p>
        <a
          href="/projects"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/projects');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] text-xs font-semibold text-white btn-tactile"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Kembali ke Daftar Proyek
        </a>
      </div>
    );
  }

  const embedUrl = project.videoUrl ? getYouTubeEmbedUrl(project.videoUrl) : null;

  return (
    <article className="max-w-[1100px] mx-auto px-4 sm:px-6 py-10 space-y-12">
      <div className="flex items-center justify-between gap-4">
        <a
          href="/projects"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/projects');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d4ed8] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Kembali ke Semua Proyek</span>
        </a>
        {isEditor && (
          <button
            type="button"
            onClick={() => onOpenEditor('projects')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[2px] text-xs font-semibold text-[#1d4ed8] bg-[#ebf2fc] border border-[#c8d7ec] whitespace-nowrap shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            Edit Proyek
          </button>
        )}
      </div>

      {/* Header + Visual Utama */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5d7699]">
            <span className="font-semibold text-[#1d4ed8]">
              {formatProjectCategory(project.category)}
            </span>
            <span aria-hidden="true">·</span>
            <span>{project.status}</span>
            <span aria-hidden="true">·</span>
            <span className="font-serif tabular-nums">{project.year}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0a1d37] leading-tight">
            {project.title}
          </h1>
          <p className="text-base text-[#456084] leading-relaxed">
            {project.overview || project.shortDescription}
          </p>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-[3px] p-1.5 bezel-recessed">
            <div className="aspect-[4/3] rounded-[2px] overflow-hidden bg-white border border-[#d4e1f3]">
              <SmartImage
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Rumusan Masalah & Tujuan */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-[#d4e1f3] pt-10">
        <div className="lg:col-span-6 space-y-3">
          <h2 className="text-xl font-bold text-[#0a1d37]">Rumusan Masalah</h2>
          <p className="text-sm sm:text-base text-[#456084] leading-relaxed">
            {project.problemStatement ||
              'Dirancang untuk menyelesaikan tantangan rekayasa praktis melalui perangkat keras modular dan perancangan firmware yang terstruktur.'}
          </p>
        </div>

        <div className="lg:col-span-6 space-y-3">
          <h2 className="text-xl font-bold text-[#0a1d37]">Tujuan</h2>
          {project.objectives.length > 0 ? (
            <ul className="space-y-2.5 text-sm sm:text-base text-[#456084]">
              {project.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="font-serif text-sm font-bold text-[#1d4ed8] mt-0.5 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span className="leading-relaxed">{obj}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#5d7699]">
              Membangun prototipe rekayasa yang terdokumentasi dan teruji.
            </p>
          )}
        </div>
      </section>

      {/* Cara Kerja Proyek */}
      <section className="surface-elevated rounded-[3px] p-6 sm:p-8 space-y-3">
        <h2 className="text-xl font-bold text-[#0a1d37]">Cara Kerja Proyek</h2>
        <p className="text-sm sm:text-base text-[#456084] leading-relaxed max-w-3xl">
          {project.howItWorks || project.shortDescription}
        </p>
      </section>

      {/* Komponen & Teknologi + Proses Pengembangan */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xl font-bold text-[#0a1d37]">
            Komponen & Teknologi yang Digunakan
          </h2>
          {project.components.length > 0 ? (
            <div className="surface-elevated rounded-[3px] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#d4e1f3] bg-[#f6f9fe] text-xs font-semibold text-[#456084]">
                    <th className="py-3 px-4">Komponen / Teknologi</th>
                    <th className="py-3 px-4">Fungsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8f0fb] text-sm">
                  {project.components.map((comp, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 font-semibold text-[#0a1d37]">
                        {comp.name}
                      </td>
                      <td className="py-3 px-4 text-[#456084]">{comp.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-[#5d7699]">
              Daftar komponen sedang dalam tahap dokumentasi.
            </p>
          )}
        </div>

        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xl font-bold text-[#0a1d37]">
            Proses Pengembangan
          </h2>
          {project.developmentProcess.length > 0 ? (
            <div className="surface-elevated rounded-[3px] divide-y divide-[#e8f0fb]">
              {project.developmentProcess.map((proc, idx) => (
                <div key={idx} className="p-4 space-y-1">
                  <h3 className="text-sm font-bold text-[#1d4ed8]">
                    {proc.step}
                  </h3>
                  <p className="text-sm text-[#456084] leading-relaxed">
                    {proc.detail}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#5d7699]">
              Pembuatan prototipe bertahap dan pengujian di meja lab.
            </p>
          )}
        </div>
      </section>

      {/* Galeri & Video */}
      {(project.galleryImages.length > 0 || embedUrl || project.videoUrl) && (
        <section className="space-y-5 border-t border-[#d4e1f3] pt-10">
          <h2 className="text-xl font-bold text-[#0a1d37]">
            Media & Galeri Proyek
          </h2>

          {embedUrl && (
            <div className="aspect-video rounded-[3px] overflow-hidden border border-[#d4e1f3] bg-[#0a1d37]">
              <iframe
                src={embedUrl}
                title={`Video ${project.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          )}

          {!embedUrl && project.videoUrl && (
            <a
              href={project.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] text-xs font-semibold text-[#0a1d37] btn-tactile-secondary"
            >
              Tonton Video Proyek
            </a>
          )}

          {project.galleryImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {project.galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-[4/3] rounded-[3px] overflow-hidden border border-[#d4e1f3] bg-white"
                >
                  <SmartImage
                    src={img}
                    alt={`${project.title} galeri ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Hasil & Capaian */}
      <section className="rounded-[3px] bg-[#ebf2fc] border border-[#c8d7ec] p-6 sm:p-8 space-y-2">
        <h2 className="text-xl font-bold text-[#0a1d37]">Hasil & Capaian</h2>
        <p className="text-sm sm:text-base text-[#2b4568] leading-relaxed max-w-3xl">
          {project.resultsOutcomes ||
            'Berhasil mendemonstrasikan tujuan fungsional utama selama pengujian anggota di laboratorium.'}
        </p>
      </section>
    </article>
  );
}
