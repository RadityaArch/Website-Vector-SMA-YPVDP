import { useState } from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import type { ProjectCategory, ProjectItem } from '../types.ts';
import { formatProjectCategory } from '../utils/labels.ts';
import { filterProjectsByCategory } from '../utils/media.ts';
import { SmartImage } from '../components/SmartImage.tsx';

interface ProjectsPageProps {
  projects: ProjectItem[];
  isEditor: boolean;
  onNavigate: (path: string) => void;
  onOpenEditor: (tab: 'projects') => void;
}

const CATEGORIES: Array<'All' | ProjectCategory> = [
  'All',
  'IoT & ESP32',
  'Robotics',
  'Electronics',
  'Embedded Systems',
];

export function ProjectsPage({
  projects,
  isEditor,
  onNavigate,
  onOpenEditor,
}: ProjectsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProjectCategory>(
    'All'
  );

  const filtered = filterProjectsByCategory(projects, selectedCategory);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#d4e1f3] pb-8">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0a1d37]">
            Proyek Rekayasa & Robotika
          </h1>
          <p className="text-sm sm:text-base text-[#456084] leading-relaxed">
            Jelajahi eksperimen perangkat keras, simpul sensor IoT ESP32, dan
            karya robotika yang dikembangkan oleh anggota VECTOR. Pilih proyek
            untuk melihat arsitektur, komponen, dan proses pengembangannya.
          </p>
        </div>

        {isEditor && (
          <button
            type="button"
            onClick={() => onOpenEditor('projects')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[2px] text-xs font-semibold text-white btn-tactile whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Kelola Proyek
          </button>
        )}
      </div>

      {/* Tab Filter Kategori */}
      <div
        role="tablist"
        aria-label="Filter proyek berdasarkan kategori"
        className="flex items-center gap-1.5 p-1 rounded-[2px] bezel-recessed overflow-x-auto w-fit max-w-full"
      >
        {CATEGORIES.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-2 rounded-[2px] text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-white text-[#0a1d37] shadow-sm'
                  : 'text-[#456084] hover:text-[#0a1d37]'
              }`}
            >
              {category === 'All'
                ? 'Semua Proyek'
                : formatProjectCategory(category)}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="surface-elevated rounded-[3px] p-10 text-center space-y-2">
          <p className="text-base font-semibold text-[#0a1d37]">
            Belum ada proyek pada kategori{' '}
            {selectedCategory === 'All'
              ? 'Semua Proyek'
              : formatProjectCategory(selectedCategory)}
            .
          </p>
          <p className="text-sm text-[#5d7699]">
            Pilih kategori lain atau tambahkan proyek baru melalui Mode Editor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
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
                    <span className="font-semibold text-[#1d4ed8]">
                      {formatProjectCategory(project.category)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{project.status}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-serif tabular-nums">{project.year}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#0a1d37] group-hover:text-[#1d4ed8] transition-colors">
                    {project.title}
                  </h2>
                  <p className="text-sm text-[#456084] leading-relaxed">
                    {project.shortDescription}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d4ed8]">
                  <span>Lihat Detail Teknis</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
