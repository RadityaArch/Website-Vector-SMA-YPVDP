import { useState } from 'react';
import { ArrowRight, FileText, Pencil } from 'lucide-react';
import type { AboutConfig } from '../types.ts';
import { OledPixelDisplay } from '../components/OledPixelDisplay.tsx';

interface AboutPageProps {
  about: AboutConfig;
  isEditor: boolean;
  onNavigate: (path: string) => void;
  onOpenEditor: (tab: 'about') => void;
}

export function AboutPage({
  about,
  isEditor,
  onNavigate,
  onOpenEditor,
}: AboutPageProps) {
  const [selectedPossibility, setSelectedPossibility] = useState(
    about.possibilities[0]?.id || ''
  );
  const [selectedStage, setSelectedStage] = useState(0);
  const [oledMode, setOledMode] = useState(0);

  const activePossibility =
    about.possibilities.find((p) => p.id === selectedPossibility) ||
    about.possibilities[0];
  const safeStageIdx =
    selectedStage < about.roadmapStages.length ? selectedStage : 0;
  const activeStage = about.roadmapStages[safeStageIdx];
  const safeOledIdx = oledMode < about.oledScreens.length ? oledMode : 0;
  const activeOled = about.oledScreens[safeOledIdx];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 space-y-20">
      {/* Navigasi Bagian Halaman */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#d4e1f3]">
        <nav
          aria-label="Bagian halaman Tentang"
          className="flex items-center gap-2 overflow-x-auto"
        >
          {[
            { href: '#intro', label: '01. Pengenalan' },
            { href: '#possibilities', label: '02. Peluang Proyek' },
            { href: '#roadmap', label: '03. Peta Jalan Belajar' },
            { href: '#keychain', label: '04. Proyek Perdana' },
            { href: '#programs', label: '05. Program Kerja 2027' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 rounded-[2px] text-xs font-semibold text-[#334e73] hover:text-[#0a1d37] hover:bg-[#ebf2fc] whitespace-nowrap shrink-0 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        {isEditor && (
          <button
            type="button"
            onClick={() => onOpenEditor('about')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[2px] text-xs font-semibold text-[#1d4ed8] bg-[#ebf2fc] border border-[#c8d7ec] hover:bg-[#dce8f8] whitespace-nowrap shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            Edit Halaman Tentang
          </button>
        )}
      </div>

      {/* A. Pengenalan Organisasi */}
      <section
        id="intro"
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
      >
        <div className="lg:col-span-7 space-y-4">
          <p className="font-serif italic text-sm text-[#1d4ed8]">
            Profil Organisasi
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0a1d37] leading-tight">
            {about.introTitle}
          </h1>
          <p className="text-base text-[#456084] leading-relaxed">
            {about.introParagraph1}
          </p>
          {about.introParagraph2 && (
            <p className="text-sm sm:text-base text-[#456084] leading-relaxed">
              {about.introParagraph2}
            </p>
          )}
        </div>

        <div className="lg:col-span-5 surface-elevated rounded-[3px] p-6 space-y-4">
          <h2 className="text-sm font-bold text-[#0a1d37]">
            {about.charterPeriodLabel}
          </h2>
          <dl className="divide-y divide-[#e8f0fb] text-sm">
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-[#5d7699]">Ekstrakurikuler</dt>
              <dd className="font-semibold text-[#0a1d37] text-right">
                {about.organizationName}
              </dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-[#5d7699]">Ketua Ekskul</dt>
              <dd className="font-semibold text-[#0a1d37] text-right">
                {about.chairpersonName}
              </dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-[#5d7699]">Fokus Utama</dt>
              <dd className="font-semibold text-[#0a1d37] text-right">
                {about.coreFocus}
              </dd>
            </div>
            <div className="py-2.5 flex justify-between gap-4">
              <dt className="text-[#5d7699]">Platform Utama</dt>
              <dd className="font-semibold text-[#0a1d37] text-right">
                {about.primaryPlatform}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* B. Peluang Proyek */}
      {about.possibilities.length > 0 && activePossibility && (
        <section id="possibilities" className="space-y-6">
          <div className="space-y-2 max-w-2xl">
            <p className="font-serif italic text-sm text-[#1d4ed8]">
              Bidang Rekayasa Terapan
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a1d37]">
              Peluang & Contoh Proyek
            </h2>
            <p className="text-sm sm:text-base text-[#456084] leading-relaxed">
              Jelajahi berbagai inovasi teknologi yang dirancang dan dirakit oleh
              anggota VECTOR di bidang robotika maupun penginderaan cerdas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 space-y-2">
              {about.possibilities.map((item) => {
                const active = item.id === activePossibility.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPossibility(item.id)}
                    className={`w-full text-left p-4 rounded-[2px] border transition-colors ${
                      active
                        ? 'bg-[#0a1d37] text-white border-[#0a1d37]'
                        : 'bg-white text-[#0a1d37] border-[#d4e1f3] hover:border-[#93b4e2]'
                    }`}
                  >
                    <div className="text-sm font-bold">{item.title}</div>
                    <div
                      className={`text-xs mt-1 ${
                        active ? 'text-[#93c5fd]' : 'text-[#5d7699]'
                      }`}
                    >
                      {item.focus}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="lg:col-span-7 surface-elevated rounded-[3px] p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="font-serif italic text-sm text-[#1d4ed8]">
                  {activePossibility.focus}
                </div>
                <h3 className="text-2xl font-bold text-[#0a1d37]">
                  {activePossibility.title}
                </h3>
                <p className="text-sm sm:text-base text-[#456084] leading-relaxed">
                  {activePossibility.summary}
                </p>
              </div>
              <div className="border-t border-[#e4eefb] pt-4 space-y-1">
                <div className="text-xs font-semibold text-[#456084]">
                  Perangkat Keras Utama
                </div>
                <div className="font-serif text-sm font-medium text-[#0a1d37]">
                  {activePossibility.hardware}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* C. Peta Jalan Belajar */}
      {about.roadmapStages.length > 0 && activeStage && (
        <section id="roadmap" className="space-y-6">
          <div className="space-y-2 max-w-2xl">
            <p className="font-serif italic text-sm text-[#1d4ed8]">
              Perkembangan Kompetensi Terstruktur
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a1d37]">
              Peta Jalan Belajar
            </h2>
            <p className="text-sm sm:text-base text-[#456084] leading-relaxed">
              Setiap anggota menempuh tahapan pembelajaran terstruktur, dari
              dasar elektronika hingga pengembangan dan peluncuran produk
              teknologi. Pilih tahap untuk melihat materinya.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {about.roadmapStages.map((stage, idx) => {
              const active = safeStageIdx === idx;
              return (
                <button
                  key={`${stage.stage}-${idx}`}
                  type="button"
                  onClick={() => setSelectedStage(idx)}
                  className={`p-3.5 rounded-[2px] text-left border transition-colors ${
                    active
                      ? 'btn-tactile text-white'
                      : 'bg-white border-[#d4e1f3] text-[#0a1d37] hover:border-[#93b4e2]'
                  }`}
                >
                  <div
                    className={`font-serif text-xs font-bold tabular-nums ${
                      active ? 'text-[#bfdbfe]' : 'text-[#1d4ed8]'
                    }`}
                  >
                    Tahap {stage.stage}
                  </div>
                  <div className="text-xs sm:text-sm font-bold mt-1 leading-snug">
                    {stage.title}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="surface-elevated rounded-[3px] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5 space-y-2">
              <div className="font-serif text-sm font-bold text-[#1d4ed8]">
                Tahap {activeStage.stage} · {activeStage.duration}
              </div>
              <h3 className="text-2xl font-bold text-[#0a1d37]">
                {activeStage.title}
              </h3>
              <p className="text-sm sm:text-base text-[#456084] leading-relaxed">
                {activeStage.summary}
              </p>
            </div>
            <div className="lg:col-span-7 space-y-2.5">
              <div className="text-xs font-bold text-[#0a1d37]">
                Capaian Pembelajaran Utama
              </div>
              <ul className="divide-y divide-[#e8f0fb] border-t border-[#e8f0fb]">
                {activeStage.topics.map((topic, idx) => (
                  <li
                    key={idx}
                    className="py-3 text-sm text-[#0a1d37] flex items-start gap-3"
                  >
                    <span className="font-serif text-xs font-bold text-[#1d4ed8] mt-0.5 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* D. Proyek Pertama: Gantungan Kunci OLED 0,96" (Tampilan Piksel Non-Teks) */}
      <section
        id="keychain"
        className="surface-elevated rounded-[3px] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
      >
        <div className="lg:col-span-6 space-y-4">
          <p className="font-serif italic text-sm text-[#1d4ed8]">
            Proyek Pengenalan Pertama
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a1d37]">
            {about.keychainTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#456084] leading-relaxed">
            {about.keychainDescription}
          </p>
          {about.keychainProjectSlug && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={`/projects/${about.keychainProjectSlug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/projects/${about.keychainProjectSlug}`);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] text-xs font-semibold text-white btn-tactile"
              >
                <span>Baca Spesifikasi Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>

        {/* Simulasi Interaktif Layar OLED 0,96" dengan Grafis Piksel Non-Teks */}
        {about.oledScreens.length > 0 && activeOled && (
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-sm oled-housing rounded-[4px] p-6 space-y-5 text-white">
              <div className="flex items-center justify-between text-[11px] font-serif tracking-wider text-[#93c5fd]">
                <span>OLED 0.96&quot; SSD1306</span>
                <span>GND · VCC · SCL · SDA</span>
              </div>

              <div className="oled-glass rounded-[2px] p-4 flex items-center justify-center">
                <OledPixelDisplay pattern={activeOled.pattern} />
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setOledMode((prev) => (prev + 1) % about.oledScreens.length)
                  }
                  className="px-4 py-2 rounded-[2px] text-xs font-semibold text-[#0a1d37] bg-[#e2ecf8] hover:bg-white transition-colors shadow-sm active:translate-y-px whitespace-nowrap shrink-0"
                >
                  Ganti Tampilan
                </button>
                <span className="font-serif text-xs text-[#93c5fd] tabular-nums whitespace-nowrap shrink-0">
                  {safeOledIdx + 1}/{about.oledScreens.length} · {activeOled.label}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* E. Program Kerja Tahunan 2027 */}
      <section id="programs" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="font-serif italic text-sm text-[#1d4ed8]">
              Jadwal Resmi Periode 2027
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0a1d37]">
              Program Kerja Tahunan 2027
            </h2>
            <p className="text-sm sm:text-base text-[#456084] leading-relaxed">
              Program kerja resmi yang membimbing pelatihan teknis anggota,
              proyek inovasi kelompok, media sosial edukatif, serta web
              portofolio pribadi setiap anggota.
            </p>
          </div>
          {about.workProgramPdfUrl && (
            <a
              href={about.workProgramPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[2px] text-xs font-semibold text-[#0a1d37] btn-tactile-secondary whitespace-nowrap shrink-0"
            >
              <FileText className="w-4 h-4 text-[#1d4ed8]" aria-hidden="true" />
              <span>Dokumen PDF Resmi 2027</span>
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {about.workPrograms.map((prog, idx) => (
            <div
              key={`${prog.number}-${idx}`}
              className="surface-elevated rounded-[3px] p-6 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4 text-xs">
                  <span className="font-serif text-sm font-bold text-[#1d4ed8] tabular-nums">
                    Program {prog.number}
                  </span>
                  <span className="font-semibold text-[#0a1d37]">
                    {prog.period}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#0a1d37] leading-snug">
                  {prog.title}
                </h3>
                <div className="space-y-2 text-sm text-[#456084] leading-relaxed">
                  <p>
                    <strong className="text-[#0a1d37] font-semibold">
                      Tujuan:{' '}
                    </strong>
                    {prog.objectives}
                  </p>
                  <p>
                    <strong className="text-[#0a1d37] font-semibold">
                      Sasaran:{' '}
                    </strong>
                    {prog.outcomes}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-[#e8f0fb] text-xs text-[#5d7699]">
                Pembina & Penanggung Jawab: {prog.mentor}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
