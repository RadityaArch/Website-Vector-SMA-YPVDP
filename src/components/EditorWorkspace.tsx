import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  Check,
  ImagePlus,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type {
  DocumentationCategory,
  DocumentationItem,
  DocumentationType,
  LandingConfig,
  ProjectCategory,
  ProjectItem,
  SiteContent,
} from '../types.ts';
import {
  createDocumentation,
  createProject,
  deleteDocumentation,
  deleteProject,
  saveLandingConfig,
  updateDocumentation,
  updateProject,
  uploadImageFile,
} from '../utils/api.ts';
import { formatDocCategory, formatProjectCategory } from '../utils/labels.ts';
import { AboutEditorTab } from './AboutEditorTab.tsx';
import { SmartImage } from './SmartImage.tsx';

export type EditorTab = 'landing' | 'projects' | 'documentation' | 'about';

interface EditorWorkspaceProps {
  open: boolean;
  initialTab?: EditorTab;
  content: SiteContent;
  onClose: () => void;
  onContentUpdated: (next: SiteContent) => void;
  onLogout: () => void;
}

const PROJECT_CATEGORIES: ProjectCategory[] = [
  'IoT & ESP32',
  'Robotics',
  'Electronics',
  'Embedded Systems',
];

const DOC_CATEGORIES: DocumentationCategory[] = [
  'Activity',
  'Workshop',
  'Event',
  'Development',
];

const inputClass =
  'w-full px-3 py-2 rounded-[2px] border border-[#bfd1ea] bg-white text-sm text-[#0a1d37] focus:border-[#1d4ed8] focus:outline-none';
const labelClass = 'block text-xs font-semibold text-[#1e3a8a] mb-1.5';

function createEmptyProjectDraft(): ProjectItem {
  return {
    id: '',
    slug: '',
    title: '',
    category: 'IoT & ESP32',
    year: '2027',
    status: 'Prototipe',
    shortDescription: '',
    thumbnailUrl: '/images/project-oled-keychain.svg',
    overview: '',
    problemStatement: '',
    objectives: [''],
    howItWorks: '',
    components: [{ name: '', role: '' }],
    developmentProcess: [{ step: '01. Riset & Perancangan', detail: '' }],
    galleryImages: [],
    videoUrl: '',
    resultsOutcomes: '',
    featuredOnLanding: false,
  };
}

function createEmptyDocDraft(): DocumentationItem {
  return {
    id: '',
    title: '',
    type: 'photo',
    category: 'Activity',
    date: new Date().toISOString().slice(0, 10),
    description: '',
    imageUrl: '/images/doc-workshop-esp32.svg',
    externalUrl: '',
    featuredOnLanding: false,
  };
}

export function EditorWorkspace({
  open,
  initialTab = 'landing',
  content,
  onClose,
  onContentUpdated,
  onLogout,
}: EditorWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>(initialTab);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const [landingDraft, setLandingDraft] = useState<LandingConfig>(() =>
    structuredClone(content.landing)
  );
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoLabel, setNewPhotoLabel] = useState('Aktivitas');
  const [newPhotoUrl, setNewPhotoUrl] = useState(
    '/images/doc-workshop-esp32.svg'
  );

  const [selectedProjectId, setSelectedProjectId] = useState<string>('new');
  const [projectDraft, setProjectDraft] = useState<ProjectItem>(() =>
    createEmptyProjectDraft()
  );

  const [selectedDocId, setSelectedDocId] = useState<string>('new');
  const [docDraft, setDocDraft] = useState<DocumentationItem>(() =>
    createEmptyDocDraft()
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    setLandingDraft(structuredClone(content.landing));
    if (selectedProjectId !== 'new') {
      const updatedProj = content.projects.find(
        (p) => p.id === selectedProjectId
      );
      if (updatedProj) {
        setProjectDraft(structuredClone(updatedProj));
      }
    }
    if (selectedDocId !== 'new') {
      const updatedDoc = content.documentation.find(
        (d) => d.id === selectedDocId
      );
      if (updatedDoc) {
        setDocDraft(structuredClone(updatedDoc));
      }
    }
  }, [content, selectedProjectId, selectedDocId]);

  if (!open) return null;

  const notify = (msg: string) => {
    setErrorMsg('');
    setStatusMsg(msg);
  };

  const fail = (err: unknown) => {
    setStatusMsg('');
    setErrorMsg(err instanceof Error ? err.message : 'Operasi gagal dijalankan.');
  };

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    onUrl: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErrorMsg('');
    try {
      const url = await uploadImageFile(file);
      onUrl(url);
      notify(
        'Gambar diunggah permanen ke folder publik. Klik tombol Simpan di bawah untuk menerapkannya.'
      );
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  const handleSaveLanding = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await saveLandingConfig(landingDraft);
      onContentUpdated(res.content);
      notify('Seluruh teks dan gambar Beranda berhasil disimpan secara permanen ke kode.');
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const handleAddLandingPhoto = () => {
    if (!newPhotoUrl.trim() || !newPhotoCaption.trim()) {
      setErrorMsg('Isi keterangan dan pilih gambar untuk foto pratinjau.');
      return;
    }
    const nextPhotos = [
      ...landingDraft.previewPhotos,
      {
        id: `lp-${Date.now()}`,
        imageUrl: newPhotoUrl.trim(),
        caption: newPhotoCaption.trim(),
        categoryLabel: newPhotoLabel.trim() || 'Aktivitas',
      },
    ];
    setLandingDraft({ ...landingDraft, previewPhotos: nextPhotos });
    setNewPhotoCaption('');
    notify(
      'Foto pratinjau ditambahkan ke draf. Klik "Simpan Halaman Beranda" untuk menyimpan permanen.'
    );
  };

  const handleToggleProjectFeatured = async (proj: ProjectItem) => {
    setBusy(true);
    try {
      const res = await updateProject({
        ...proj,
        featuredOnLanding: !proj.featuredOnLanding,
      });
      onContentUpdated(res.content);
      notify(`Tampilan beranda untuk "${proj.title}" diperbarui.`);
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const handleToggleDocFeatured = async (doc: DocumentationItem) => {
    setBusy(true);
    try {
      const res = await updateDocumentation({
        ...doc,
        featuredOnLanding: !doc.featuredOnLanding,
      });
      onContentUpdated(res.content);
      notify(`Tampilan beranda untuk "${doc.title}" diperbarui.`);
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const selectProjectForEdit = (id: string) => {
    setSelectedProjectId(id);
    setErrorMsg('');
    setStatusMsg('');
    if (id === 'new') {
      setProjectDraft(createEmptyProjectDraft());
      return;
    }
    const found = content.projects.find((p) => p.id === id);
    if (found) {
      setProjectDraft(structuredClone(found));
    }
  };

  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectDraft.title.trim() || !projectDraft.shortDescription.trim()) {
      setErrorMsg('Judul proyek dan deskripsi singkat wajib diisi.');
      return;
    }
    setBusy(true);
    try {
      const cleanProject: ProjectItem = {
        ...projectDraft,
        objectives: projectDraft.objectives.map((s) => s.trim()).filter(Boolean),
        components: projectDraft.components.filter((c) => c.name.trim()),
        developmentProcess: projectDraft.developmentProcess.filter((s) =>
          s.step.trim()
        ),
        galleryImages: projectDraft.galleryImages.filter(Boolean),
      };
      const res =
        selectedProjectId === 'new'
          ? await createProject(cleanProject)
          : await updateProject(cleanProject);
      onContentUpdated(res.content);
      setSelectedProjectId(res.project.id);
      setProjectDraft(structuredClone(res.project));
      notify(
        `Proyek "${res.project.title}" berhasil disimpan secara permanen.`
      );
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    setBusy(true);
    try {
      const res = await deleteProject(id);
      onContentUpdated(res.content);
      setSelectedProjectId('new');
      setProjectDraft(createEmptyProjectDraft());
      notify('Proyek berhasil dihapus dari penyimpanan.');
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const selectDocForEdit = (id: string) => {
    setSelectedDocId(id);
    setErrorMsg('');
    setStatusMsg('');
    if (id === 'new') {
      setDocDraft(createEmptyDocDraft());
      return;
    }
    const found = content.documentation.find((d) => d.id === id);
    if (found) {
      setDocDraft(structuredClone(found));
    }
  };

  const handleSaveDoc = async (e: FormEvent) => {
    e.preventDefault();
    if (!docDraft.title.trim()) {
      setErrorMsg('Judul dokumentasi wajib diisi.');
      return;
    }
    if (
      (docDraft.type === 'youtube' || docDraft.type === 'instagram') &&
      !docDraft.externalUrl.trim()
    ) {
      setErrorMsg('Masukkan tautan URL untuk entri YouTube atau Instagram.');
      return;
    }
    setBusy(true);
    try {
      const res =
        selectedDocId === 'new'
          ? await createDocumentation(docDraft)
          : await updateDocumentation(docDraft);
      onContentUpdated(res.content);
      setSelectedDocId(res.item.id);
      setDocDraft(structuredClone(res.item));
      notify(
        `Entri dokumentasi "${res.item.title}" berhasil disimpan secara permanen.`
      );
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    setBusy(true);
    try {
      const res = await deleteDocumentation(id);
      onContentUpdated(res.content);
      setSelectedDocId('new');
      setDocDraft(createEmptyDocDraft());
      notify('Entri dokumentasi berhasil dihapus.');
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cms-workspace-title"
      className="fixed inset-0 z-50 bg-[#0a1d37]/55 flex justify-end"
    >
      <div className="w-full max-w-4xl bg-[#f4f7fc] h-full overflow-hidden border-l border-[#bfd1ea] shadow-2xl flex flex-col">
        {/* Header Workspace */}
        <header className="shrink-0 bg-[#0a1d37] text-white px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#1e3a8a]">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#93c5fd]">
              Ruang Pengeditan Konten VECTOR
            </div>
            <h2 id="cms-workspace-title" className="text-lg font-bold text-white">
              Editor Teks & Media Permanen
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 whitespace-nowrap shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              Kunci Editor
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup ruang editor"
              className="w-9 h-9 rounded-[2px] flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Tab Navigasi Utama Editor */}
        <nav
          aria-label="Menu tab editor"
          className="shrink-0 bg-white border-b border-[#d4e1f3] px-5 flex items-center gap-1 overflow-x-auto"
        >
          {(
            [
              { id: 'landing', label: '1. Beranda' },
              { id: 'projects', label: '2. Proyek' },
              { id: 'documentation', label: '3. Dokumentasi' },
              { id: 'about', label: '4. Halaman Tentang' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setStatusMsg('');
                setErrorMsg('');
              }}
              className={`px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap shrink-0 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#1d4ed8] text-[#1d4ed8] bg-[#f8fbff]'
                  : 'border-transparent text-[#456084] hover:text-[#0a1d37]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-5 space-y-5 flex-1 overflow-y-auto">
          {statusMsg && (
            <div
              role="status"
              className="flex items-center gap-2 text-xs font-semibold text-[#1e40af] bg-[#eff6ff] border-l-4 border-l-[#1d4ed8] border border-[#bfdbfe] rounded-[2px] px-4 py-3"
            >
              <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{statusMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div
              role="alert"
              className="text-xs font-semibold text-[#b91c1c] bg-[#fef2f2] border-l-4 border-l-[#b91c1c] border border-[#fecaca] rounded-[2px] px-4 py-3"
            >
              {errorMsg}
            </div>
          )}

          {/* TAB 1: HALAMAN BERANDA */}
          {activeTab === 'landing' && (
            <form onSubmit={handleSaveLanding} className="space-y-6 pb-20">
              {/* Hero & Visual Utama */}
              <section className="bg-white border border-[#d4e1f3] rounded-[3px] p-5 space-y-4">
                <div className="border-b border-[#e4eefb] pb-3">
                  <h3 className="text-base font-bold text-[#0a1d37]">
                    Bagian Atas (Hero) & Gambar Utama
                  </h3>
                  <p className="text-xs text-[#5d7699] mt-0.5">
                    Mengubah label pengantar, judul utama, ringkasan, serta gambar
                    hero di halaman depan.
                  </p>
                </div>

                <div>
                  <label htmlFor="hero-kicker-input" className={labelClass}>
                    Label Pengantar Atas (Kicker)
                  </label>
                  <input
                    id="hero-kicker-input"
                    type="text"
                    value={landingDraft.heroKicker}
                    onChange={(e) =>
                      setLandingDraft({
                        ...landingDraft,
                        heroKicker: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="hero-headline-input" className={labelClass}>
                    Judul Utama Hero
                  </label>
                  <input
                    id="hero-headline-input"
                    type="text"
                    value={landingDraft.heroHeadline}
                    onChange={(e) =>
                      setLandingDraft({
                        ...landingDraft,
                        heroHeadline: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="hero-subheadline-input" className={labelClass}>
                    Paragraf Pengantar Hero
                  </label>
                  <textarea
                    id="hero-subheadline-input"
                    rows={3}
                    value={landingDraft.heroSubheadline}
                    onChange={(e) =>
                      setLandingDraft({
                        ...landingDraft,
                        heroSubheadline: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2 border-t border-[#e4eefb]">
                  <div className="md:col-span-4 aspect-[16/10] bg-[#f4f7fc] border border-[#dce7f5] rounded-[2px] overflow-hidden">
                    <SmartImage
                      src={landingDraft.heroImageUrl}
                      alt="Pratinjau gambar utama hero"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-8 space-y-2">
                    <label htmlFor="hero-image-input" className={labelClass}>
                      URL Gambar Hero atau Unggah Berkas Baru
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="hero-image-input"
                        type="text"
                        value={landingDraft.heroImageUrl}
                        onChange={(e) =>
                          setLandingDraft({
                            ...landingDraft,
                            heroImageUrl: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] text-xs font-semibold text-[#0a1d37] btn-tactile-secondary cursor-pointer whitespace-nowrap shrink-0">
                        <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Unggah</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) =>
                            handleImageUpload(e, (url) =>
                              setLandingDraft({
                                ...landingDraft,
                                heroImageUrl: url,
                              })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Pengenalan & 4 Bidang Inti */}
              <section className="bg-white border border-[#d4e1f3] rounded-[3px] p-5 space-y-4">
                <div className="border-b border-[#e4eefb] pb-3">
                  <h3 className="text-base font-bold text-[#0a1d37]">
                    Bagian Pengenalan & Bidang Fokus (4 Pilar)
                  </h3>
                  <p className="text-xs text-[#5d7699] mt-0.5">
                    Mengatur penjelasan apa itu VECTOR dan 4 kolom bidang inti.
                  </p>
                </div>

                <div>
                  <label htmlFor="intro-section-title" className={labelClass}>
                    Judul Bagian Pengenalan
                  </label>
                  <input
                    id="intro-section-title"
                    type="text"
                    value={landingDraft.introSectionTitle}
                    onChange={(e) =>
                      setLandingDraft({
                        ...landingDraft,
                        introSectionTitle: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="intro-section-body" className={labelClass}>
                    Teks Penjelasan Pengenalan
                  </label>
                  <textarea
                    id="intro-section-body"
                    rows={3}
                    value={landingDraft.introSectionBody}
                    onChange={(e) =>
                      setLandingDraft({
                        ...landingDraft,
                        introSectionBody: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div className="pt-2 border-t border-[#e4eefb] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0a1d37]">
                      Daftar Bidang Fokus ({landingDraft.disciplines.length})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setLandingDraft({
                          ...landingDraft,
                          disciplines: [
                            ...landingDraft.disciplines,
                            {
                              index: String(
                                landingDraft.disciplines.length + 1
                              ).padStart(2, '0'),
                              title: 'Bidang Baru',
                              description: '',
                            },
                          ],
                        })
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[2px] text-xs font-semibold text-[#0a1d37] btn-tactile-secondary"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      Tambah Bidang
                    </button>
                  </div>

                  <div className="divide-y divide-[#e4eefb] border border-[#dce7f5] rounded-[2px]">
                    {landingDraft.disciplines.map((disc, idx) => (
                      <div key={idx} className="p-3 bg-[#f8fbff] space-y-2.5">
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                          <div className="sm:col-span-2">
                            <label
                              htmlFor={`disc-idx-${idx}`}
                              className={labelClass}
                            >
                              Nomor
                            </label>
                            <input
                              id={`disc-idx-${idx}`}
                              type="text"
                              value={disc.index}
                              onChange={(e) => {
                                const next = [...landingDraft.disciplines];
                                next[idx] = { ...disc, index: e.target.value };
                                setLandingDraft({
                                  ...landingDraft,
                                  disciplines: next,
                                });
                              }}
                              className={inputClass}
                            />
                          </div>
                          <div className="sm:col-span-9">
                            <label
                              htmlFor={`disc-title-${idx}`}
                              className={labelClass}
                            >
                              Nama Bidang
                            </label>
                            <input
                              id={`disc-title-${idx}`}
                              type="text"
                              value={disc.title}
                              onChange={(e) => {
                                const next = [...landingDraft.disciplines];
                                next[idx] = { ...disc, title: e.target.value };
                                setLandingDraft({
                                  ...landingDraft,
                                  disciplines: next,
                                });
                              }}
                              className={inputClass}
                            />
                          </div>
                          <div className="sm:col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                setLandingDraft({
                                  ...landingDraft,
                                  disciplines: landingDraft.disciplines.filter(
                                    (_, i) => i !== idx
                                  ),
                                })
                              }
                              aria-label={`Hapus bidang ${disc.title}`}
                              className="p-2 rounded-[2px] text-[#b91c1c] hover:bg-[#fef2f2]"
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor={`disc-desc-${idx}`}
                            className={labelClass}
                          >
                            Penjelasan Singkat Bidang
                          </label>
                          <textarea
                            id={`disc-desc-${idx}`}
                            rows={2}
                            value={disc.description}
                            onChange={(e) => {
                              const next = [...landingDraft.disciplines];
                              next[idx] = {
                                ...disc,
                                description: e.target.value,
                              };
                              setLandingDraft({
                                ...landingDraft,
                                disciplines: next,
                              });
                            }}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Judul Bagian Proyek, Dokumentasi, & Banner Ajakan Bawah */}
              <section className="bg-white border border-[#d4e1f3] rounded-[3px] p-5 space-y-4">
                <div className="border-b border-[#e4eefb] pb-3">
                  <h3 className="text-base font-bold text-[#0a1d37]">
                    Judul Bagian Beranda & Banner Ajakan (CTA)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="feat-proj-title" className={labelClass}>
                      Judul Bagian Proyek Pilihan
                    </label>
                    <input
                      id="feat-proj-title"
                      type="text"
                      value={landingDraft.featuredProjectsTitle}
                      onChange={(e) =>
                        setLandingDraft({
                          ...landingDraft,
                          featuredProjectsTitle: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="feat-proj-sub" className={labelClass}>
                      Subjudul Bagian Proyek Pilihan
                    </label>
                    <input
                      id="feat-proj-sub"
                      type="text"
                      value={landingDraft.featuredProjectsSubtitle}
                      onChange={(e) =>
                        setLandingDraft({
                          ...landingDraft,
                          featuredProjectsSubtitle: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="feat-docs-title" className={labelClass}>
                      Judul Bagian Dokumentasi Terkini
                    </label>
                    <input
                      id="feat-docs-title"
                      type="text"
                      value={landingDraft.featuredDocsTitle}
                      onChange={(e) =>
                        setLandingDraft({
                          ...landingDraft,
                          featuredDocsTitle: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="feat-docs-sub" className={labelClass}>
                      Subjudul Bagian Dokumentasi Terkini
                    </label>
                    <input
                      id="feat-docs-sub"
                      type="text"
                      value={landingDraft.featuredDocsSubtitle}
                      onChange={(e) =>
                        setLandingDraft({
                          ...landingDraft,
                          featuredDocsSubtitle: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e4eefb] grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cta-kicker" className={labelClass}>
                      Label Kecil Banner Bawah
                    </label>
                    <input
                      id="cta-kicker"
                      type="text"
                      value={landingDraft.ctaKicker}
                      onChange={(e) =>
                        setLandingDraft({
                          ...landingDraft,
                          ctaKicker: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="cta-title" className={labelClass}>
                      Judul Banner Ajakan Bawah
                    </label>
                    <input
                      id="cta-title"
                      type="text"
                      value={landingDraft.ctaTitle}
                      onChange={(e) =>
                        setLandingDraft({
                          ...landingDraft,
                          ctaTitle: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="cta-body" className={labelClass}>
                      Paragraf Banner Ajakan Bawah
                    </label>
                    <textarea
                      id="cta-body"
                      rows={2}
                      value={landingDraft.ctaBody}
                      onChange={(e) =>
                        setLandingDraft({
                          ...landingDraft,
                          ctaBody: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              {/* Foto Pratinjau Beranda */}
              <section className="bg-white border border-[#d4e1f3] rounded-[3px] p-5 space-y-4">
                <div className="border-b border-[#e4eefb] pb-3">
                  <h3 className="text-base font-bold text-[#0a1d37]">
                    Foto Pratinjau Beranda ({landingDraft.previewPhotos.length})
                  </h3>
                </div>

                <div className="divide-y divide-[#e4eefb] border border-[#dce7f5] rounded-[2px]">
                  {landingDraft.previewPhotos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="p-3 bg-[#f8fbff] grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                    >
                      <div className="md:col-span-3 aspect-[4/3] bg-white border border-[#dce7f5] rounded-[2px] overflow-hidden">
                        <SmartImage
                          src={photo.imageUrl}
                          alt={photo.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-6 space-y-2">
                        <div>
                          <label
                            htmlFor={`lp-cap-${index}`}
                            className={labelClass}
                          >
                            Keterangan Foto #{index + 1}
                          </label>
                          <input
                            id={`lp-cap-${index}`}
                            type="text"
                            value={photo.caption}
                            onChange={(e) => {
                              const next = [...landingDraft.previewPhotos];
                              next[index] = {
                                ...photo,
                                caption: e.target.value,
                              };
                              setLandingDraft({
                                ...landingDraft,
                                previewPhotos: next,
                              });
                            }}
                            className={inputClass}
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label
                              htmlFor={`lp-lbl-${index}`}
                              className={labelClass}
                            >
                              Label Kategori
                            </label>
                            <input
                              id={`lp-lbl-${index}`}
                              type="text"
                              value={photo.categoryLabel}
                              onChange={(e) => {
                                const next = [...landingDraft.previewPhotos];
                                next[index] = {
                                  ...photo,
                                  categoryLabel: e.target.value,
                                };
                                setLandingDraft({
                                  ...landingDraft,
                                  previewPhotos: next,
                                });
                              }}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`lp-url-${index}`}
                              className={labelClass}
                            >
                              URL Gambar
                            </label>
                            <input
                              id={`lp-url-${index}`}
                              type="text"
                              value={photo.imageUrl}
                              onChange={(e) => {
                                const next = [...landingDraft.previewPhotos];
                                next[index] = {
                                  ...photo,
                                  imageUrl: e.target.value,
                                };
                                setLandingDraft({
                                  ...landingDraft,
                                  previewPhotos: next,
                                });
                              }}
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-3 flex flex-wrap md:flex-col gap-2 items-stretch">
                        <label className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-semibold text-[#1d4ed8] bg-white border border-[#bfd1ea] cursor-pointer">
                          <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Ganti Gambar</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) =>
                              handleImageUpload(e, (url) => {
                                const next = [...landingDraft.previewPhotos];
                                next[index] = { ...photo, imageUrl: url };
                                setLandingDraft({
                                  ...landingDraft,
                                  previewPhotos: next,
                                });
                              })
                            }
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const next = landingDraft.previewPhotos.filter(
                              (p) => p.id !== photo.id
                            );
                            setLandingDraft({
                              ...landingDraft,
                              previewPhotos: next,
                            });
                          }}
                          className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-[2px] text-xs font-semibold text-[#b91c1c] border border-[#fecaca] bg-[#fef2f2] hover:bg-[#fee2e2]"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tambah Foto Pratinjau Baru */}
                <div className="bg-[#f4f7fc] border border-[#dce7f5] rounded-[2px] p-4 space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0a1d37]">
                    Tambah Foto Pratinjau Baru
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="new-lp-cap" className={labelClass}>
                        Keterangan Foto
                      </label>
                      <input
                        id="new-lp-cap"
                        type="text"
                        placeholder="Keterangan singkat"
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="new-lp-lbl" className={labelClass}>
                        Label Kategori
                      </label>
                      <input
                        id="new-lp-lbl"
                        type="text"
                        placeholder="mis. Workshop"
                        value={newPhotoLabel}
                        onChange={(e) => setNewPhotoLabel(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="new-lp-url" className={labelClass}>
                        URL atau Unggah Gambar
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="new-lp-url"
                          type="text"
                          value={newPhotoUrl}
                          onChange={(e) => setNewPhotoUrl(e.target.value)}
                          className={inputClass}
                        />
                        <label
                          aria-label="Unggah foto pratinjau baru"
                          className="p-2 rounded-[2px] btn-tactile-secondary cursor-pointer shrink-0"
                        >
                          <ImagePlus className="w-4 h-4 text-[#1d4ed8]" />
                          <input
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={(e) =>
                              handleImageUpload(e, (url) => setNewPhotoUrl(url))
                            }
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLandingPhoto}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[2px] text-xs font-semibold text-[#0a1d37] btn-tactile-secondary"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    Tambahkan Foto ke Beranda
                  </button>
                </div>
              </section>

              {/* Pilihan Proyek & Aktivitas yang Tampil di Beranda */}
              <section className="bg-white border border-[#d4e1f3] rounded-[3px] p-5 space-y-4">
                <div className="border-b border-[#e4eefb] pb-3">
                  <h3 className="text-base font-bold text-[#0a1d37]">
                    Proyek & Aktivitas Pilihan di Beranda
                  </h3>
                  <p className="text-xs text-[#5d7699] mt-0.5">
                    Centang item yang ingin langsung muncul di halaman depan.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#1e3a8a]">
                      Proyek Pilihan
                    </h4>
                    <div className="divide-y divide-[#e4eefb] border border-[#dce7f5] rounded-[2px]">
                      {content.projects.map((proj) => (
                        <label
                          key={proj.id}
                          className="flex items-center justify-between gap-3 px-3 py-2.5 bg-white hover:bg-[#f8fbff] cursor-pointer"
                        >
                          <span className="text-xs font-medium text-[#0a1d37] truncate">
                            {proj.title}
                          </span>
                          <input
                            type="checkbox"
                            checked={proj.featuredOnLanding}
                            onChange={() => handleToggleProjectFeatured(proj)}
                            className="w-4 h-4 accent-[#1d4ed8]"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#1e3a8a]">
                      Dokumentasi & Aktivitas Pilihan
                    </h4>
                    <div className="divide-y divide-[#e4eefb] border border-[#dce7f5] rounded-[2px]">
                      {content.documentation.map((doc) => (
                        <label
                          key={doc.id}
                          className="flex items-center justify-between gap-3 px-3 py-2.5 bg-white hover:bg-[#f8fbff] cursor-pointer"
                        >
                          <span className="text-xs font-medium text-[#0a1d37] truncate">
                            {doc.title}
                          </span>
                          <input
                            type="checkbox"
                            checked={doc.featuredOnLanding}
                            onChange={() => handleToggleDocFeatured(doc)}
                            className="w-4 h-4 accent-[#1d4ed8]"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Bilah Simpan Tetap Beranda */}
              <div className="sticky bottom-0 z-10 -mx-5 px-5 py-3.5 bg-white border-t border-[#d4e1f3] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#456084]">
                  Semua teks dan gambar Beranda ditulis permanen ke kode situs.
                </span>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] text-xs font-semibold text-white btn-tactile disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" aria-hidden="true" />
                  {busy ? 'Menyimpan...' : 'Simpan Halaman Beranda'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PROYEK */}
          {activeTab === 'projects' && (
            <div className="space-y-5 pb-20">
              <div className="bg-white border border-[#d4e1f3] rounded-[3px] p-4 space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5d7699]">
                  Pilih Proyek untuk Diedit atau Buat Baru
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => selectProjectForEdit('new')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-semibold ${
                      selectedProjectId === 'new'
                        ? 'bg-[#1d4ed8] text-white'
                        : 'bg-[#f1f6fe] border border-[#dce7f5] text-[#0a1d37]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    Proyek Baru
                  </button>
                  {content.projects.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectProjectForEdit(p.id)}
                      className={`px-3 py-1.5 rounded-[2px] text-xs font-medium truncate max-w-[220px] ${
                        selectedProjectId === p.id
                          ? 'bg-[#0a1d37] text-white'
                          : 'bg-white border border-[#dce7f5] text-[#334e73] hover:text-[#0a1d37]'
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              <form
                onSubmit={handleSaveProject}
                className="bg-white border border-[#d4e1f3] rounded-[3px] p-5 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e4eefb] pb-3">
                  <h3 className="text-base font-bold text-[#0a1d37]">
                    {selectedProjectId === 'new'
                      ? 'Buat Proyek Baru'
                      : `Mengedit Proyek: ${projectDraft.title}`}
                  </h3>
                  {selectedProjectId !== 'new' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(selectedProjectId)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[2px] text-xs font-semibold text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca]"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Hapus Proyek
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="proj-title" className={labelClass}>
                      Judul Proyek *
                    </label>
                    <input
                      id="proj-title"
                      type="text"
                      required
                      value={projectDraft.title}
                      onChange={(e) =>
                        setProjectDraft({
                          ...projectDraft,
                          title: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="proj-category" className={labelClass}>
                      Kategori
                    </label>
                    <select
                      id="proj-category"
                      value={projectDraft.category}
                      onChange={(e) =>
                        setProjectDraft({
                          ...projectDraft,
                          category: e.target.value as ProjectCategory,
                        })
                      }
                      className={inputClass}
                    >
                      {PROJECT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {formatProjectCategory(cat)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="proj-year" className={labelClass}>
                      Tahun
                    </label>
                    <input
                      id="proj-year"
                      type="text"
                      value={projectDraft.year}
                      onChange={(e) =>
                        setProjectDraft({
                          ...projectDraft,
                          year: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="proj-status" className={labelClass}>
                      Status Pengembangan
                    </label>
                    <input
                      id="proj-status"
                      type="text"
                      value={projectDraft.status}
                      onChange={(e) =>
                        setProjectDraft({
                          ...projectDraft,
                          status: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-3 border-t border-[#e4eefb]">
                  <div className="md:col-span-4 aspect-[16/10] bg-[#f4f7fc] border border-[#dce7f5] rounded-[2px] overflow-hidden">
                    <SmartImage
                      src={projectDraft.thumbnailUrl}
                      alt={projectDraft.title || 'Sampul proyek'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-8">
                    <label htmlFor="proj-thumb" className={labelClass}>
                      URL Gambar Sampul atau Unggah Berkas
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="proj-thumb"
                        type="text"
                        value={projectDraft.thumbnailUrl}
                        onChange={(e) =>
                          setProjectDraft({
                            ...projectDraft,
                            thumbnailUrl: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] text-xs font-semibold text-[#0a1d37] btn-tactile-secondary cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Unggah</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) =>
                            handleImageUpload(e, (url) =>
                              setProjectDraft({
                                ...projectDraft,
                                thumbnailUrl: url,
                              })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="proj-short" className={labelClass}>
                    Deskripsi Singkat Kartu *
                  </label>
                  <textarea
                    id="proj-short"
                    rows={2}
                    required
                    value={projectDraft.shortDescription}
                    onChange={(e) =>
                      setProjectDraft({
                        ...projectDraft,
                        shortDescription: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="proj-overview" className={labelClass}>
                      Ringkasan Lengkap Proyek
                    </label>
                    <textarea
                      id="proj-overview"
                      rows={3}
                      value={projectDraft.overview}
                      onChange={(e) =>
                        setProjectDraft({
                          ...projectDraft,
                          overview: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="proj-problem" className={labelClass}>
                      Rumusan Masalah
                    </label>
                    <textarea
                      id="proj-problem"
                      rows={3}
                      value={projectDraft.problemStatement}
                      onChange={(e) =>
                        setProjectDraft({
                          ...projectDraft,
                          problemStatement: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="proj-objectives" className={labelClass}>
                    Tujuan Proyek (satu poin per baris)
                  </label>
                  <textarea
                    id="proj-objectives"
                    rows={3}
                    value={projectDraft.objectives.join('\n')}
                    onChange={(e) =>
                      setProjectDraft({
                        ...projectDraft,
                        objectives: e.target.value.split('\n'),
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="proj-works" className={labelClass}>
                    Cara Kerja Proyek
                  </label>
                  <textarea
                    id="proj-works"
                    rows={3}
                    value={projectDraft.howItWorks}
                    onChange={(e) =>
                      setProjectDraft({
                        ...projectDraft,
                        howItWorks: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                {/* Komponen & Teknologi */}
                <div className="pt-3 border-t border-[#e4eefb] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0a1d37]">
                      Komponen & Teknologi
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setProjectDraft({
                          ...projectDraft,
                          components: [
                            ...projectDraft.components,
                            { name: '', role: '' },
                          ],
                        })
                      }
                      className="text-xs font-semibold text-[#1d4ed8] hover:underline"
                    >
                      + Tambah Komponen
                    </button>
                  </div>
                  <div className="space-y-2">
                    {projectDraft.components.map((comp, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center"
                      >
                        <input
                          type="text"
                          aria-label={`Nama komponen ${idx + 1}`}
                          placeholder="Nama Komponen / Teknologi"
                          value={comp.name}
                          onChange={(e) => {
                            const next = [...projectDraft.components];
                            next[idx] = { ...comp, name: e.target.value };
                            setProjectDraft({
                              ...projectDraft,
                              components: next,
                            });
                          }}
                          className={`sm:col-span-5 ${inputClass}`}
                        />
                        <input
                          type="text"
                          aria-label={`Fungsi komponen ${idx + 1}`}
                          placeholder="Fungsi / Spesifikasi"
                          value={comp.role}
                          onChange={(e) => {
                            const next = [...projectDraft.components];
                            next[idx] = { ...comp, role: e.target.value };
                            setProjectDraft({
                              ...projectDraft,
                              components: next,
                            });
                          }}
                          className={`sm:col-span-5 ${inputClass}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProjectDraft({
                              ...projectDraft,
                              components: projectDraft.components.filter(
                                (_, i) => i !== idx
                              ),
                            })
                          }
                          aria-label={`Hapus komponen ${idx + 1}`}
                          className="sm:col-span-1 text-xs font-semibold text-[#b91c1c] hover:underline"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tahapan Proses Pengembangan */}
                <div className="pt-3 border-t border-[#e4eefb] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0a1d37]">
                      Tahapan Proses Pengembangan
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setProjectDraft({
                          ...projectDraft,
                          developmentProcess: [
                            ...projectDraft.developmentProcess,
                            { step: '', detail: '' },
                          ],
                        })
                      }
                      className="text-xs font-semibold text-[#1d4ed8] hover:underline"
                    >
                      + Tambah Tahap
                    </button>
                  </div>
                  <div className="space-y-2">
                    {projectDraft.developmentProcess.map((proc, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center"
                      >
                        <input
                          type="text"
                          aria-label={`Nama tahap ${idx + 1}`}
                          placeholder="Nama tahap"
                          value={proc.step}
                          onChange={(e) => {
                            const next = [...projectDraft.developmentProcess];
                            next[idx] = { ...proc, step: e.target.value };
                            setProjectDraft({
                              ...projectDraft,
                              developmentProcess: next,
                            });
                          }}
                          className={`sm:col-span-5 ${inputClass}`}
                        />
                        <input
                          type="text"
                          aria-label={`Rincian tahap ${idx + 1}`}
                          placeholder="Rincian proses"
                          value={proc.detail}
                          onChange={(e) => {
                            const next = [...projectDraft.developmentProcess];
                            next[idx] = { ...proc, detail: e.target.value };
                            setProjectDraft({
                              ...projectDraft,
                              developmentProcess: next,
                            });
                          }}
                          className={`sm:col-span-5 ${inputClass}`}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setProjectDraft({
                              ...projectDraft,
                              developmentProcess:
                                projectDraft.developmentProcess.filter(
                                  (_, i) => i !== idx
                                ),
                            })
                          }
                          aria-label={`Hapus tahap ${idx + 1}`}
                          className="sm:col-span-1 text-xs font-semibold text-[#b91c1c] hover:underline"
                        >
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Galeri & Video */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-[#e4eefb]">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="proj-gallery" className="text-xs font-semibold text-[#1e3a8a]">
                        URL Gambar Galeri (satu per baris)
                      </label>
                      <label className="text-xs font-semibold text-[#1d4ed8] cursor-pointer hover:underline">
                        + Unggah Gambar
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) =>
                            handleImageUpload(e, (url) =>
                              setProjectDraft({
                                ...projectDraft,
                                galleryImages: [
                                  ...projectDraft.galleryImages,
                                  url,
                                ],
                              })
                            )
                          }
                        />
                      </label>
                    </div>
                    <textarea
                      id="proj-gallery"
                      rows={2}
                      value={projectDraft.galleryImages.join('\n')}
                      onChange={(e) =>
                        setProjectDraft({
                          ...projectDraft,
                          galleryImages: e.target.value.split('\n'),
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="proj-video" className={labelClass}>
                      URL Video Proyek (YouTube opsional)
                    </label>
                    <input
                      id="proj-video"
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={projectDraft.videoUrl}
                      onChange={(e) =>
                        setProjectDraft({
                          ...projectDraft,
                          videoUrl: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="proj-results" className={labelClass}>
                    Hasil & Capaian
                  </label>
                  <textarea
                    id="proj-results"
                    rows={2}
                    value={projectDraft.resultsOutcomes}
                    onChange={(e) =>
                      setProjectDraft({
                        ...projectDraft,
                        resultsOutcomes: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#0a1d37] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={projectDraft.featuredOnLanding}
                    onChange={(e) =>
                      setProjectDraft({
                        ...projectDraft,
                        featuredOnLanding: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#1d4ed8]"
                  />
                  Tampilkan proyek ini di halaman beranda
                </label>

                <div className="sticky bottom-0 z-10 -mx-5 -mb-5 px-5 py-3.5 bg-white border-t border-[#d4e1f3] flex justify-end">
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] text-xs font-semibold text-white btn-tactile disabled:opacity-60"
                  >
                    <Save className="w-3.5 h-3.5" aria-hidden="true" />
                    {busy ? 'Menyimpan...' : 'Simpan Proyek'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: DOKUMENTASI */}
          {activeTab === 'documentation' && (
            <div className="space-y-5 pb-20">
              <div className="bg-white border border-[#d4e1f3] rounded-[3px] p-4 space-y-2.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#5d7699]">
                  Pilih Entri Dokumentasi atau Tambah Baru
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => selectDocForEdit('new')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] text-xs font-semibold ${
                      selectedDocId === 'new'
                        ? 'bg-[#1d4ed8] text-white'
                        : 'bg-[#f1f6fe] border border-[#dce7f5] text-[#0a1d37]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    Entri Baru
                  </button>
                  {content.documentation.map((doc) => (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => selectDocForEdit(doc.id)}
                      className={`px-3 py-1.5 rounded-[2px] text-xs font-medium truncate max-w-[220px] ${
                        selectedDocId === doc.id
                          ? 'bg-[#0a1d37] text-white'
                          : 'bg-white border border-[#dce7f5] text-[#334e73] hover:text-[#0a1d37]'
                      }`}
                    >
                      {doc.title}
                    </button>
                  ))}
                </div>
              </div>

              <form
                onSubmit={handleSaveDoc}
                className="bg-white border border-[#d4e1f3] rounded-[3px] p-5 space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e4eefb] pb-3">
                  <h3 className="text-base font-bold text-[#0a1d37]">
                    {selectedDocId === 'new'
                      ? 'Tambah Entri Dokumentasi'
                      : `Mengedit Dokumentasi: ${docDraft.title}`}
                  </h3>
                  {selectedDocId !== 'new' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteDoc(selectedDocId)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[2px] text-xs font-semibold text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca]"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Hapus Entri
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="doc-title" className={labelClass}>
                      Judul *
                    </label>
                    <input
                      id="doc-title"
                      type="text"
                      required
                      value={docDraft.title}
                      onChange={(e) =>
                        setDocDraft({ ...docDraft, title: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="doc-type" className={labelClass}>
                      Jenis Media
                    </label>
                    <select
                      id="doc-type"
                      value={docDraft.type}
                      onChange={(e) =>
                        setDocDraft({
                          ...docDraft,
                          type: e.target.value as DocumentationType,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="photo">Foto</option>
                      <option value="youtube">Tautan Video YouTube</option>
                      <option value="instagram">
                        Tautan Video / Pos Instagram
                      </option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="doc-category" className={labelClass}>
                      Kategori
                    </label>
                    <select
                      id="doc-category"
                      value={docDraft.category}
                      onChange={(e) =>
                        setDocDraft({
                          ...docDraft,
                          category: e.target.value as DocumentationCategory,
                        })
                      }
                      className={inputClass}
                    >
                      {DOC_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {formatDocCategory(cat)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="doc-date" className={labelClass}>
                      Tanggal
                    </label>
                    <input
                      id="doc-date"
                      type="date"
                      value={docDraft.date}
                      onChange={(e) =>
                        setDocDraft({ ...docDraft, date: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-3 border-t border-[#e4eefb]">
                  <div className="md:col-span-4 aspect-[16/10] bg-[#f4f7fc] border border-[#dce7f5] rounded-[2px] overflow-hidden">
                    <SmartImage
                      src={docDraft.imageUrl}
                      alt={docDraft.title || 'Sampul dokumentasi'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:col-span-8">
                    <label htmlFor="doc-image" className={labelClass}>
                      URL Foto / Sampul atau Unggah Berkas
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="doc-image"
                        type="text"
                        value={docDraft.imageUrl}
                        onChange={(e) =>
                          setDocDraft({ ...docDraft, imageUrl: e.target.value })
                        }
                        className={inputClass}
                      />
                      <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[2px] text-xs font-semibold text-[#0a1d37] btn-tactile-secondary cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Unggah Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) =>
                            handleImageUpload(e, (url) =>
                              setDocDraft({ ...docDraft, imageUrl: url })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {(docDraft.type === 'youtube' ||
                  docDraft.type === 'instagram') && (
                  <div>
                    <label htmlFor="doc-external-url" className={labelClass}>
                      {docDraft.type === 'youtube'
                        ? 'URL Video YouTube *'
                        : 'URL Pos atau Reel Instagram *'}
                    </label>
                    <input
                      id="doc-external-url"
                      type="url"
                      required
                      placeholder={
                        docDraft.type === 'youtube'
                          ? 'https://www.youtube.com/watch?v=...'
                          : 'https://www.instagram.com/p/...'
                      }
                      value={docDraft.externalUrl}
                      onChange={(e) =>
                        setDocDraft({
                          ...docDraft,
                          externalUrl: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="doc-description" className={labelClass}>
                    Deskripsi
                  </label>
                  <textarea
                    id="doc-description"
                    rows={3}
                    value={docDraft.description}
                    onChange={(e) =>
                      setDocDraft({ ...docDraft, description: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#0a1d37] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={docDraft.featuredOnLanding}
                    onChange={(e) =>
                      setDocDraft({
                        ...docDraft,
                        featuredOnLanding: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#1d4ed8]"
                  />
                  Tampilkan di halaman beranda
                </label>

                <div className="sticky bottom-0 z-10 -mx-5 -mb-5 px-5 py-3.5 bg-white border-t border-[#d4e1f3] flex justify-end">
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[3px] text-xs font-semibold text-white btn-tactile disabled:opacity-60"
                  >
                    <Save className="w-3.5 h-3.5" aria-hidden="true" />
                    {busy ? 'Menyimpan...' : 'Simpan Dokumentasi'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: HALAMAN TENTANG */}
          {activeTab === 'about' && (
            <AboutEditorTab
              initialAbout={content.about}
              busy={busy}
              setBusy={setBusy}
              onNotify={notify}
              onFail={fail}
              onContentUpdated={onContentUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
}
