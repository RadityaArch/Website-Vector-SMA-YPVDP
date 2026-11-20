import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type RoutePath =
  | { page: 'home' }
  | { page: 'projects' }
  | { page: 'project-detail'; slug: string }
  | { page: 'documentation' }
  | { page: 'about' };

interface NavbarProps {
  currentPage: RoutePath['page'];
  onNavigate: (path: string) => void;
}

const NAV_ITEMS: Array<{ label: string; path: string; match: RoutePath['page'][] }> = [
  { label: 'Beranda', path: '/', match: ['home'] },
  { label: 'Proyek', path: '/projects', match: ['projects', 'project-detail'] },
  { label: 'Dokumentasi', path: '/documentation', match: ['documentation'] },
  { label: 'Tentang', path: '/about', match: ['about'] },
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (path: string) => {
    setMobileOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f6f9fe]/95 backdrop-blur-sm border-b border-[#d4e1f3]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('/');
          }}
          className="inline-flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#0a1d37] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d4ed8] rounded-[2px]"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect x="2" y="2" width="20" height="20" rx="2" fill="#1D4ED8" />
            <path
              d="M7 7.5L12 16.5L17 7.5"
              stroke="#FFFFFF"
              strokeWidth="2.2"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
          <span>VECTOR</span>
        </a>

        {/* Zone 2: Navigation links */}
        <nav
          aria-label="Navigasi utama"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const active = item.match.includes(currentPage);
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.path);
                }}
                aria-current={active ? 'page' : undefined}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d4ed8] rounded-[2px] ${
                  active
                    ? 'text-[#1d4ed8] font-semibold'
                    : 'text-[#334e73] hover:text-[#0a1d37]'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-[#1d4ed8]"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary action + mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/about#programs"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('/about#programs');
            }}
            className="hidden md:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white rounded-[2px] btn-tactile whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]"
          >
            Program 2027
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-[2px] btn-tactile-secondary text-[#0a1d37]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Navigasi seluler"
          className="md:hidden border-t border-[#d4e1f3] bg-white px-4 py-3 space-y-1"
        >
          {NAV_ITEMS.map((item) => {
            const active = item.match.includes(currentPage);
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(item.path);
                }}
                aria-current={active ? 'page' : undefined}
                className={`block px-3 py-2.5 rounded-[2px] text-sm font-medium ${
                  active
                    ? 'bg-[#ebf2fc] text-[#1d4ed8] font-semibold'
                    : 'text-[#334e73] hover:bg-[#f6f9fe]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      )}
    </header>
  );
}
