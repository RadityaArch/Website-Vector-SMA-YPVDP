import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import type { AboutConfig, OledPatternType, SiteContent } from '../types.ts';
import { saveAboutConfig } from '../utils/api.ts';
import { OledPixelDisplay } from './OledPixelDisplay.tsx';

interface AboutEditorTabProps {
  initialAbout: AboutConfig;
  busy: boolean;
  setBusy: (busy: boolean) => void;
  onNotify: (msg: string) => void;
  onFail: (err: unknown) => void;
  onContentUpdated: (next: SiteContent) => void;
}

type AboutSubSection = 'all' | 'profile' | 'possibilities' | 'roadmap' | 'oled' | 'programs';

const OLED_PATTERN_OPTIONS: { value: OledPatternType; label: string }[] = [
  { value: 'smiley', label: 'Wajah Tersenyum (Smiley)' },
  { value: 'wink', label: 'Ekspresi Kedip (Wink)' },
  { value: 'robot', label: 'Kepala Robot (Robot)' },
  { value: 'wave', label: 'Gelombang Sinyal (Wave)' },
  { value: 'heart', label: 'Ikon Hati (Heart)' },
];

const inputClass =
  'w-full px-3 py-2 rounded-[2px] border border-[#bfd1ea] bg-white text-sm text-[#0a1d37] focus:border-[#1d4ed8] focus:outline-none';
const labelClass = 'block text-xs font-semibold text-[#1e3a8a] mb-1.5';

export function AboutEditorTab({
  initialAbout,
  busy,
  setBusy,
  onNotify,
  onFail,
  onContentUpdated,
}: AboutEditorTabProps) {
  const [draft, setDraft] = useState<AboutConfig>(() =>
    structuredClone(initialAbout)
  );
  const [section, setSection] = useState<AboutSubSection>('all');

  useEffect(() => {
    setDraft(structuredClone(initialAbout));
  }, [initialAbout]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft.introTitle.trim()) {
      onFail(new Error('Judul utama pengenalan organisasi wajib diisi.'));
      return;
    }
    setBusy(true);
    try {
      const res = await saveAboutConfig(draft);
      onContentUpdated(res.content);
      onNotify(
        'Halaman Tentang dan metadata footer berhasil disimpan secara permanen ke kode.'
      );
    } catch (err) {
      onFail(err);
    } finally {
      setBusy(false);
    }
  };

  const showSection = (target: Exclude<AboutSubSection, 'all'>) =>
    section === 'all' || section === target;

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-20">
      {/* Navigasi Sub-Bagian Halaman Tentang */}
      <div className="bg-white border border-[#d4e1f3] rounded-[3px] p-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#5d7699] mb-2">
          Filter Bagian Halaman Tentang
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'all', label: 'Semua Bagian' },
              { id: 'profile', label: 'A. Profil & Footer' },
              { id: 'possibilities', label: 'B. Peluang Proyek' },
              { id: 'roadmap', label: 'C. Peta Jalan' },
              { id: 'oled', label: 'D. Gantungan Kunci OLED' },
              { id: 'programs', label: 'E. Program Kerja 2027' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`px-3 py-1.5 rounded-[2px] text-xs font-semibold transition-colors ${
                section === item.id
                  ? 'bg-[#0a1d37] text-white'
                  : 'bg-[#f1f6fe] text-[#334e73] border border-[#dce7f5] hover:text-[#0a1d37]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* A. Profil & Identitas Organisasi + Footer */}
      {showSection('profile') && (
        <section className="bg-white border border-[#d4e1f3] rounded-[3px] p-5 space-y-5">
          <div className="border-b border-[#e4eefb] pb-3">
            <h3 className="text-base font-bold text-[#0a1d37]">
              A. Profil Organisasi & Deskripsi Footer
            </h3>
            <p className="text-xs text-[#5d7699] mt-0.5">
              Mengatur identitas resmi VECTOR di halaman Tentang sekaligus nama,
              ketua, deskripsi, dan tautan PDF pada footer situs.
            </p>
          </div>

          <div>
            <label htmlFor="about-intro-title" className={labelClass}>
              Judul Utama Pengenalan *
            </label>
            <input
              id="about-intro-title"
              type="text"
              required
              value={draft.introTitle}
              onChange={(e) => setDraft({ ...draft, introTitle: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="about-p1" className={labelClass}>
                Paragraf Pengenalan 1
              </label>
              <textarea
                id="about-p1"
                rows={4}
                value={draft.introParagraph1}
                onChange={(e) =>
                  setDraft({ ...draft, introParagraph1: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="about-p2" className={labelClass}>
                Paragraf Pengenalan 2
              </label>
              <textarea
                id="about-p2"
                rows={4}
                value={draft.introParagraph2}
                onChange={(e) =>
                  setDraft({ ...draft, introParagraph2: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#e4eefb] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="about-charter-label" className={labelClass}>
                Label Kartu Identitas
              </label>
              <input
                id="about-charter-label"
                type="text"
                value={draft.charterPeriodLabel}
                onChange={(e) =>
                  setDraft({ ...draft, charterPeriodLabel: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="about-org-name" className={labelClass}>
                Nama Organisasi (tampil di Kartu & Footer)
              </label>
              <input
                id="about-org-name"
                type="text"
                value={draft.organizationName}
                onChange={(e) =>
                  setDraft({ ...draft, organizationName: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="about-chairperson" className={labelClass}>
                Ketua Ekskul (tampil di Kartu & Footer)
              </label>
              <input
                id="about-chairperson"
                type="text"
                value={draft.chairpersonName}
                onChange={(e) =>
                  setDraft({ ...draft, chairpersonName: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="about-focus" className={labelClass}>
                Fokus Utama Organisasi
              </label>
              <input
                id="about-focus"
                type="text"
                value={draft.coreFocus}
                onChange={(e) => setDraft({ ...draft, coreFocus: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="about-platform" className={labelClass}>
                Platform Perangkat Keras Utama
              </label>
              <input
                id="about-platform"
                type="text"
                value={draft.primaryPlatform}
                onChange={(e) =>
                  setDraft({ ...draft, primaryPlatform: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="about-footer-desc" className={labelClass}>
                Deskripsi Organisasi di Bagian Bawah (Footer)
              </label>
              <textarea
                id="about-footer-desc"
                rows={3}
                value={draft.footerDescription}
                onChange={(e) =>
                  setDraft({ ...draft, footerDescription: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>
        </section>
      )}

      {/* B. Peluang & Contoh Proyek */}
      {showSection('possibilities') && (
        <section className="bg-white border border-[#d4e1f3] rounded-[3px] p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4eefb] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0a1d37]">
                B. Peluang & Contoh Proyek ({draft.possibilities.length})
              </h3>
              <p className="text-xs text-[#5d7699] mt-0.5">
                Daftar contoh eksplorasi proyek bagi anggota baru VECTOR.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  possibilities: [
                    ...draft.possibilities,
                    {
                      id: `poss-${Date.now()}`,
                      title: 'Proyek Inovasi Baru',
                      focus: 'Bidang Rekayasa',
                      summary: '',
                      hardware: '',
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-semibold text-[#0a1d37] btn-tactile-secondary"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Tambah Peluang
            </button>
          </div>

          <div className="divide-y divide-[#e4eefb]">
            {draft.possibilities.map((item, idx) => (
              <div key={item.id} className="py-5 first:pt-1 last:pb-1 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1d4ed8]">
                    Contoh Proyek #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        possibilities: draft.possibilities.filter(
                          (_, i) => i !== idx
                        ),
                      })
                    }
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-[2px] text-xs font-semibold text-[#b91c1c] hover:bg-[#fef2f2]"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Hapus
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor={`poss-title-${idx}`}
                      className={labelClass}
                    >
                      Judul Contoh Proyek
                    </label>
                    <input
                      id={`poss-title-${idx}`}
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...draft.possibilities];
                        next[idx] = { ...item, title: e.target.value };
                        setDraft({ ...draft, possibilities: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`poss-focus-${idx}`}
                      className={labelClass}
                    >
                      Fokus Bidang Teknologi
                    </label>
                    <input
                      id={`poss-focus-${idx}`}
                      type="text"
                      value={item.focus}
                      onChange={(e) => {
                        const next = [...draft.possibilities];
                        next[idx] = { ...item, focus: e.target.value };
                        setDraft({ ...draft, possibilities: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`poss-summary-${idx}`} className={labelClass}>
                    Ringkasan Konsep
                  </label>
                  <textarea
                    id={`poss-summary-${idx}`}
                    rows={2}
                    value={item.summary}
                    onChange={(e) => {
                      const next = [...draft.possibilities];
                      next[idx] = { ...item, summary: e.target.value };
                      setDraft({ ...draft, possibilities: next });
                    }}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor={`poss-hw-${idx}`} className={labelClass}>
                    Perangkat Keras Utama
                  </label>
                  <input
                    id={`poss-hw-${idx}`}
                    type="text"
                    value={item.hardware}
                    onChange={(e) => {
                      const next = [...draft.possibilities];
                      next[idx] = { ...item, hardware: e.target.value };
                      setDraft({ ...draft, possibilities: next });
                    }}
                    className={`${inputClass} font-serif`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* C. Peta Jalan Belajar */}
      {showSection('roadmap') && (
        <section className="bg-white border border-[#d4e1f3] rounded-[3px] p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4eefb] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0a1d37]">
                C. Peta Jalan Belajar ({draft.roadmapStages.length} Tahap)
              </h3>
              <p className="text-xs text-[#5d7699] mt-0.5">
                Urutan materi pembelajaran terstruktur dari dasar hingga produk.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  roadmapStages: [
                    ...draft.roadmapStages,
                    {
                      stage: String(draft.roadmapStages.length + 1).padStart(
                        2,
                        '0'
                      ),
                      title: 'Tahap Baru',
                      duration: 'Lanjutan',
                      summary: '',
                      topics: [''],
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-semibold text-[#0a1d37] btn-tactile-secondary"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Tambah Tahap
            </button>
          </div>

          <div className="divide-y divide-[#e4eefb]">
            {draft.roadmapStages.map((stage, idx) => (
              <div key={idx} className="py-5 first:pt-1 last:pb-1 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1d4ed8]">
                    Tahap {stage.stage}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        roadmapStages: draft.roadmapStages.filter(
                          (_, i) => i !== idx
                        ),
                      })
                    }
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-[2px] text-xs font-semibold text-[#b91c1c] hover:bg-[#fef2f2]"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Hapus
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor={`stage-num-${idx}`}
                      className={labelClass}
                    >
                      Nomor Tahap
                    </label>
                    <input
                      id={`stage-num-${idx}`}
                      type="text"
                      value={stage.stage}
                      onChange={(e) => {
                        const next = [...draft.roadmapStages];
                        next[idx] = { ...stage, stage: e.target.value };
                        setDraft({ ...draft, roadmapStages: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`stage-title-${idx}`}
                      className={labelClass}
                    >
                      Judul Tahap
                    </label>
                    <input
                      id={`stage-title-${idx}`}
                      type="text"
                      value={stage.title}
                      onChange={(e) => {
                        const next = [...draft.roadmapStages];
                        next[idx] = { ...stage, title: e.target.value };
                        setDraft({ ...draft, roadmapStages: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`stage-dur-${idx}`}
                      className={labelClass}
                    >
                      Label Fase / Durasi
                    </label>
                    <input
                      id={`stage-dur-${idx}`}
                      type="text"
                      value={stage.duration}
                      onChange={(e) => {
                        const next = [...draft.roadmapStages];
                        next[idx] = { ...stage, duration: e.target.value };
                        setDraft({ ...draft, roadmapStages: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`stage-sum-${idx}`} className={labelClass}>
                    Ringkasan Materi Tahap
                  </label>
                  <textarea
                    id={`stage-sum-${idx}`}
                    rows={2}
                    value={stage.summary}
                    onChange={(e) => {
                      const next = [...draft.roadmapStages];
                      next[idx] = { ...stage, summary: e.target.value };
                      setDraft({ ...draft, roadmapStages: next });
                    }}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor={`stage-topics-${idx}`} className={labelClass}>
                    Topik Capaian (tulis satu poin per baris)
                  </label>
                  <textarea
                    id={`stage-topics-${idx}`}
                    rows={3}
                    value={stage.topics.join('\n')}
                    onChange={(e) => {
                      const next = [...draft.roadmapStages];
                      next[idx] = { ...stage, topics: e.target.value.split('\n') };
                      setDraft({ ...draft, roadmapStages: next });
                    }}
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* D. Proyek Pertama: Gantungan Kunci OLED 0,96" */}
      {showSection('oled') && (
        <section className="bg-white border border-[#d4e1f3] rounded-[3px] p-5 space-y-5">
          <div className="border-b border-[#e4eefb] pb-3">
            <h3 className="text-base font-bold text-[#0a1d37]">
              D. Proyek Pertama: Gantungan Kunci OLED 0,96 Inci
            </h3>
            <p className="text-xs text-[#5d7699] mt-0.5">
              Mengatur deskripsi dan pola grafis piksel (non-teks) pada
              simulator layar OLED.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="about-keychain-title" className={labelClass}>
                Judul Bagian Proyek Pertama
              </label>
              <input
                id="about-keychain-title"
                type="text"
                value={draft.keychainTitle}
                onChange={(e) =>
                  setDraft({ ...draft, keychainTitle: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="about-keychain-slug" className={labelClass}>
                Slug Proyek Tujuan
              </label>
              <input
                id="about-keychain-slug"
                type="text"
                value={draft.keychainProjectSlug}
                onChange={(e) =>
                  setDraft({ ...draft, keychainProjectSlug: e.target.value })
                }
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="about-keychain-desc" className={labelClass}>
              Deskripsi Proyek Pertama
            </label>
            <textarea
              id="about-keychain-desc"
              rows={3}
              value={draft.keychainDescription}
              onChange={(e) =>
                setDraft({ ...draft, keychainDescription: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div className="pt-4 border-t border-[#e4eefb] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0a1d37]">
                  Daftar Mode Grafis Layar OLED ({draft.oledScreens.length})
                </h4>
                <p className="text-xs text-[#5d7699]">
                  Setiap mode menampilkan animasi grafis piksel murni tanpa
                  teks di layar OLED.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    oledScreens: [
                      ...draft.oledScreens,
                      {
                        label: 'Ekspresi Baru',
                        pattern: 'smiley',
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-semibold text-[#0a1d37] btn-tactile-secondary"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                Tambah Mode OLED
              </button>
            </div>

            <div className="divide-y divide-[#e4eefb] border border-[#dce7f5] rounded-[2px]">
              {draft.oledScreens.map((screen, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#f8fbff] grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                >
                  <div className="md:col-span-3 bg-[#091529] border border-[#1e3a8a] rounded-[2px] p-2">
                    <OledPixelDisplay pattern={screen.pattern} />
                  </div>
                  <div className="md:col-span-4">
                    <label
                      htmlFor={`oled-label-${idx}`}
                      className={labelClass}
                    >
                      Nama Mode Tampilan #{idx + 1}
                    </label>
                    <input
                      id={`oled-label-${idx}`}
                      type="text"
                      value={screen.label}
                      onChange={(e) => {
                        const next = [...draft.oledScreens];
                        next[idx] = { ...screen, label: e.target.value };
                        setDraft({ ...draft, oledScreens: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label
                      htmlFor={`oled-pattern-${idx}`}
                      className={labelClass}
                    >
                      Pola Grafis Piksel
                    </label>
                    <select
                      id={`oled-pattern-${idx}`}
                      value={screen.pattern}
                      onChange={(e) => {
                        const next = [...draft.oledScreens];
                        next[idx] = {
                          ...screen,
                          pattern: e.target.value as OledPatternType,
                        };
                        setDraft({ ...draft, oledScreens: next });
                      }}
                      className={inputClass}
                    >
                      {OLED_PATTERN_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      disabled={draft.oledScreens.length <= 1}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          oledScreens: draft.oledScreens.filter(
                            (_, i) => i !== idx
                          ),
                        })
                      }
                      aria-label={`Hapus mode OLED ${screen.label}`}
                      className="p-2 rounded-[2px] text-[#b91c1c] hover:bg-[#fef2f2] disabled:opacity-40"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* E. Program Kerja Tahunan */}
      {showSection('programs') && (
        <section className="bg-white border border-[#d4e1f3] rounded-[3px] p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4eefb] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#0a1d37]">
                E. Program Kerja Tahunan ({draft.workPrograms.length})
              </h3>
              <p className="text-xs text-[#5d7699] mt-0.5">
                Daftar agenda kerja resmi VECTOR beserta tautan dokumen PDF.
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  workPrograms: [
                    ...draft.workPrograms,
                    {
                      number: String(draft.workPrograms.length + 1).padStart(
                        2,
                        '0'
                      ),
                      title: 'Program Kerja Baru',
                      period: 'Januari – Desember',
                      mentor: 'Ketua Ekskul & Pembina',
                      objectives: '',
                      outcomes: '',
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-semibold text-[#0a1d37] btn-tactile-secondary"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              Tambah Program
            </button>
          </div>

          <div>
            <label htmlFor="about-pdf-url" className={labelClass}>
              URL Dokumen PDF Program Kerja (tampil di Tentang & Footer)
            </label>
            <input
              id="about-pdf-url"
              type="text"
              value={draft.workProgramPdfUrl}
              onChange={(e) =>
                setDraft({ ...draft, workProgramPdfUrl: e.target.value })
              }
              className={inputClass}
            />
          </div>

          <div className="divide-y divide-[#e4eefb]">
            {draft.workPrograms.map((prog, idx) => (
              <div key={idx} className="py-5 first:pt-1 last:pb-1 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1d4ed8]">
                    Program Kerja {prog.number}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        workPrograms: draft.workPrograms.filter(
                          (_, i) => i !== idx
                        ),
                      })
                    }
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-[2px] text-xs font-semibold text-[#b91c1c] hover:bg-[#fef2f2]"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Hapus
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label
                      htmlFor={`prog-num-${idx}`}
                      className={labelClass}
                    >
                      Nomor Program
                    </label>
                    <input
                      id={`prog-num-${idx}`}
                      type="text"
                      value={prog.number}
                      onChange={(e) => {
                        const next = [...draft.workPrograms];
                        next[idx] = { ...prog, number: e.target.value };
                        setDraft({ ...draft, workPrograms: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`prog-period-${idx}`}
                      className={labelClass}
                    >
                      Periode Pelaksanaan
                    </label>
                    <input
                      id={`prog-period-${idx}`}
                      type="text"
                      value={prog.period}
                      onChange={(e) => {
                        const next = [...draft.workPrograms];
                        next[idx] = { ...prog, period: e.target.value };
                        setDraft({ ...draft, workPrograms: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`prog-mentor-${idx}`}
                      className={labelClass}
                    >
                      Pembina / Penanggung Jawab
                    </label>
                    <input
                      id={`prog-mentor-${idx}`}
                      type="text"
                      value={prog.mentor}
                      onChange={(e) => {
                        const next = [...draft.workPrograms];
                        next[idx] = { ...prog, mentor: e.target.value };
                        setDraft({ ...draft, workPrograms: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`prog-title-${idx}`} className={labelClass}>
                    Nama Program Kerja
                  </label>
                  <input
                    id={`prog-title-${idx}`}
                    type="text"
                    value={prog.title}
                    onChange={(e) => {
                      const next = [...draft.workPrograms];
                      next[idx] = { ...prog, title: e.target.value };
                      setDraft({ ...draft, workPrograms: next });
                    }}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`prog-obj-${idx}`} className={labelClass}>
                      Tujuan Program
                    </label>
                    <textarea
                      id={`prog-obj-${idx}`}
                      rows={2}
                      value={prog.objectives}
                      onChange={(e) => {
                        const next = [...draft.workPrograms];
                        next[idx] = { ...prog, objectives: e.target.value };
                        setDraft({ ...draft, workPrograms: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor={`prog-out-${idx}`} className={labelClass}>
                      Sasaran & Capaian
                    </label>
                    <textarea
                      id={`prog-out-${idx}`}
                      rows={2}
                      value={prog.outcomes}
                      onChange={(e) => {
                        const next = [...draft.workPrograms];
                        next[idx] = { ...prog, outcomes: e.target.value };
                        setDraft({ ...draft, workPrograms: next });
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bilah Simpan Tetap */}
      <div className="sticky bottom-0 z-10 -mx-5 px-5 py-3.5 bg-white border-t border-[#d4e1f3] flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-[#456084]">
          Perubahan ditulis langsung ke penyimpanan kode proyek dan diperbarui
          untuk semua pengunjung.
        </span>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] text-xs font-semibold text-white btn-tactile disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" aria-hidden="true" />
          {busy ? 'Menyimpan...' : 'Simpan Halaman Tentang'}
        </button>
      </div>
    </form>
  );
}
