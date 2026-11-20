interface FooterProps {
  onNavigate: (path: string) => void;
  organizationName?: string;
  chairpersonName?: string;
  footerDescription?: string;
  workProgramPdfUrl?: string;
}

export function Footer({
  onNavigate,
  organizationName = 'VECTOR',
  chairpersonName = 'Radithya Archietilla',
  footerDescription = 'Vidatra Engineering, Coding, Technology of Robotics. Organisasi ekstrakurikuler siswa yang mengembangkan keterampilan praktis di bidang elektronika, pemrograman tertanam, inovasi IoT, dan robotika.',
  workProgramPdfUrl = '/assets/aistudio/PROGRAM_KERJA_EKSTRAKURIKULER_VECTOR_PERIODE_2027_3091cc05.pdf',
}: FooterProps) {
  return (
    <footer className="border-t border-[#d4e1f3] bg-white mt-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-6 space-y-3">
            <div className="text-base font-bold tracking-tight text-[#0a1d37]">
              {organizationName}
            </div>
            <p className="text-sm text-[#456084] max-w-md leading-relaxed">
              {footerDescription}
            </p>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h2 className="text-xs font-semibold text-[#0a1d37]">Navigasi</h2>
            <ul className="space-y-2 text-sm text-[#456084]">
              <li>
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/');
                  }}
                  className="hover:text-[#1d4ed8] transition-colors"
                >
                  Beranda
                </a>
              </li>
              <li>
                <a
                  href="/projects"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/projects');
                  }}
                  className="hover:text-[#1d4ed8] transition-colors"
                >
                  Proyek
                </a>
              </li>
              <li>
                <a
                  href="/documentation"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/documentation');
                  }}
                  className="hover:text-[#1d4ed8] transition-colors"
                >
                  Dokumentasi
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('/about');
                  }}
                  className="hover:text-[#1d4ed8] transition-colors"
                >
                  Tentang {organizationName}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2.5">
            <h2 className="text-xs font-semibold text-[#0a1d37]">Periode 2027</h2>
            <p className="text-sm text-[#456084]">
              Ketua Ekskul: {chairpersonName}
            </p>
            {workProgramPdfUrl && (
              <a
                href={workProgramPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium text-[#1d4ed8] hover:underline"
              >
                Dokumen Program Kerja (PDF)
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#e8f0fb] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#5d7699]">
          <span className="font-serif">
            {organizationName} · Vidatra Engineering, Coding, Technology of Robotics
          </span>
          <span>Pusat Digital Resmi Organisasi · Periode 2027</span>
        </div>
      </div>
    </footer>
  );
}
