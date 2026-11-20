import { useState } from 'react';
import { ExternalLink, Play, Plus, X } from 'lucide-react';
import type { DocumentationCategory, DocumentationItem } from '../types.ts';
import { formatDocCategory } from '../utils/labels.ts';
import { filterDocumentation, getYouTubeEmbedUrl } from '../utils/media.ts';
import { SmartImage } from '../components/SmartImage.tsx';

interface DocumentationPageProps {
  documentation: DocumentationItem[];
  isEditor: boolean;
  onOpenEditor: (tab: 'documentation') => void;
}

const FILTERS: Array<'All' | DocumentationCategory | 'Videos'> = [
  'All',
  'Workshop',
  'Activity',
  'Event',
  'Development',
  'Videos',
];

function getFilterLabel(filter: 'All' | DocumentationCategory | 'Videos'): string {
  if (filter === 'All') return 'Semua Entri';
  if (filter === 'Videos') return 'Video';
  return formatDocCategory(filter);
}

export function DocumentationPage({
  documentation,
  isEditor,
  onOpenEditor,
}: DocumentationPageProps) {
  const [activeFilter, setActiveFilter] = useState<
    'All' | DocumentationCategory | 'Videos'
  >('All');
  const [selectedItem, setSelectedItem] = useState<DocumentationItem | null>(null);

  const items = filterDocumentation(documentation, activeFilter);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#d4e1f3] pb-8">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0a1d37]">
            Dokumentasi Aktivitas & Media
          </h1>
          <p className="text-sm sm:text-base text-[#456084] leading-relaxed">
            Arsip visual kegiatan workshop, sesi pengembangan prototipe, acara
            organisasi, video demonstrasi YouTube, serta unggahan Instagram
            VECTOR.
          </p>
        </div>
        {isEditor && (
          <button
            type="button"
            onClick={() => onOpenEditor('documentation')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[2px] text-xs font-semibold text-white btn-tactile whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Kelola Dokumentasi
          </button>
        )}
      </div>

      {/* Filter Kategori */}
      <div
        role="tablist"
        aria-label="Filter entri dokumentasi"
        className="flex items-center gap-1.5 p-1 rounded-[2px] bezel-recessed overflow-x-auto w-fit max-w-full"
      >
        {FILTERS.map((filter) => {
          const active = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-2 rounded-[2px] text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                active
                  ? 'bg-white text-[#0a1d37] shadow-sm'
                  : 'text-[#456084] hover:text-[#0a1d37]'
              }`}
            >
              {getFilterLabel(filter)}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="surface-elevated rounded-[3px] p-10 text-center space-y-2">
          <p className="text-base font-semibold text-[#0a1d37]">
            Belum ada dokumentasi untuk kategori "{getFilterLabel(activeFilter)}".
          </p>
          <p className="text-sm text-[#5d7699]">
            Pilih filter lain atau tambahkan dokumentasi melalui Mode Editor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isVideo = item.type === 'youtube' || item.type === 'instagram';
            return (
              <article
                key={item.id}
                className="surface-elevated rounded-[3px] overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-[#ebf2fc] border-b border-[#d4e1f3] overflow-hidden">
                  <SmartImage
                    src={item.imageUrl || '/images/doc-workshop-esp32.svg'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.type === 'youtube' && (
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      aria-label={`Putar video YouTube: ${item.title}`}
                      className="absolute inset-0 flex items-center justify-center bg-[#0a1d37]/35 hover:bg-[#0a1d37]/45 transition-colors"
                    >
                      <span className="w-12 h-12 rounded-[2px] bg-white text-[#1d4ed8] flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 ml-0.5" aria-hidden="true" />
                      </span>
                    </button>
                  )}
                  {item.type === 'photo' && (
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      aria-label={`Lihat foto: ${item.title}`}
                      className="absolute inset-0 bg-transparent hover:bg-[#0a1d37]/10 transition-colors"
                    />
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-[#5d7699]">
                      <span className="font-semibold text-[#1d4ed8]">
                        {formatDocCategory(item.category)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-serif tabular-nums">{item.date}</span>
                      {isVideo && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>
                            {item.type === 'youtube' ? 'YouTube' : 'Instagram'}
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="text-base font-bold text-[#0a1d37]">
                      {item.title}
                    </h2>
                    <p className="text-sm text-[#456084] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-1">
                    {item.type === 'photo' && (
                      <button
                        type="button"
                        onClick={() => setSelectedItem(item)}
                        className="text-xs font-semibold text-[#1d4ed8] hover:underline"
                      >
                        Lihat Foto Penuh
                      </button>
                    )}
                    {item.type === 'youtube' && (
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setSelectedItem(item)}
                          className="text-xs font-semibold text-[#1d4ed8] hover:underline"
                        >
                          Putar Video
                        </button>
                        {item.externalUrl && (
                          <a
                            href={item.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#456084] hover:text-[#0a1d37]"
                          >
                            <span>Buka YouTube</span>
                            <ExternalLink className="w-3 h-3" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    )}
                    {item.type === 'instagram' && item.externalUrl && (
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1d4ed8] hover:underline"
                      >
                        <span>Buka di Instagram</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal Lightbox / Video */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="doc-modal-title"
          className="fixed inset-0 z-50 bg-[#0a1d37]/75 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="w-full max-w-3xl bg-white rounded-[3px] overflow-hidden border border-[#d4e1f3] shadow-2xl">
            <div className="px-5 py-4 border-b border-[#d4e1f3] flex items-center justify-between gap-4">
              <div>
                <h2
                  id="doc-modal-title"
                  className="text-base font-bold text-[#0a1d37]"
                >
                  {selectedItem.title}
                </h2>
                <div className="text-xs text-[#5d7699] font-serif tabular-nums">
                  {formatDocCategory(selectedItem.category)} · {selectedItem.date}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Tutup penampil dokumentasi"
                className="w-9 h-9 rounded-[2px] flex items-center justify-center text-[#456084] hover:bg-[#ebf2fc]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {selectedItem.type === 'youtube' &&
              getYouTubeEmbedUrl(selectedItem.externalUrl) ? (
                <div className="aspect-video rounded-[2px] overflow-hidden bg-[#0a1d37]">
                  <iframe
                    src={getYouTubeEmbedUrl(selectedItem.externalUrl) || ''}
                    title={selectedItem.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="max-h-[65vh] rounded-[2px] overflow-hidden bg-[#f6f9fe] border border-[#d4e1f3]">
                  <SmartImage
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="w-full h-full object-contain max-h-[65vh]"
                  />
                </div>
              )}

              <p className="text-sm text-[#456084] leading-relaxed">
                {selectedItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
