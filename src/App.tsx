import { useCallback, useEffect, useState } from 'react';
import { Pencil, Settings2 } from 'lucide-react';
import type { SiteContent } from './types.ts';
import {
  fetchAuthSession,
  fetchSiteContent,
  logoutEditor,
} from './utils/api.ts';
import { Navbar, type RoutePath } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { PinAuthModal } from './components/PinAuthModal.tsx';
import { EditorWorkspace, type EditorTab } from './components/EditorWorkspace.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.tsx';
import { DocumentationPage } from './pages/DocumentationPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';

function parseRoute(pathname: string): RoutePath {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/') return { page: 'home' };
  if (clean === '/projects') return { page: 'projects' };
  if (clean.startsWith('/projects/')) {
    const slug = decodeURIComponent(clean.slice('/projects/'.length));
    return { page: 'project-detail', slug };
  }
  if (clean === '/documentation') return { page: 'documentation' };
  if (clean === '/about') return { page: 'about' };
  return { page: 'home' };
}

export default function App() {
  const [route, setRoute] = useState<RoutePath>(() =>
    parseRoute(window.location.pathname)
  );
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [isEditor, setIsEditor] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<EditorTab>('landing');

  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [siteData, sessionData] = await Promise.all([
        fetchSiteContent(),
        fetchAuthSession().catch(() => ({ authenticated: false })),
      ]);
      setContent(siteData);
      setIsEditor(sessionData.authenticated);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : 'Gagal memuat konten situs web.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseRoute(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((targetPath: string) => {
    const [pathOnly, hashPart] = targetPath.split('#');
    const normalized = pathOnly || '/';
    if (
      window.location.pathname !== normalized ||
      window.location.hash !== (hashPart ? `#${hashPart}` : '')
    ) {
      window.history.pushState({}, '', targetPath);
    }
    setRoute(parseRoute(normalized));

    if (hashPart) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hashPart);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, []);

  const handlePencilClick = () => {
    if (isEditor) {
      setEditorTab('landing');
      setEditorOpen(true);
    } else {
      setPinModalOpen(true);
    }
  };

  const handleOpenEditorTab = (tab: EditorTab) => {
    if (!isEditor) {
      setPinModalOpen(true);
      return;
    }
    setEditorTab(tab);
    setEditorOpen(true);
  };

  const handleAuthenticated = () => {
    setIsEditor(true);
    setPinModalOpen(false);
    const contextualTab: EditorTab =
      route.page === 'about'
        ? 'about'
        : route.page === 'documentation'
          ? 'documentation'
          : route.page === 'projects' || route.page === 'project-detail'
            ? 'projects'
            : 'landing';
    setEditorTab(contextualTab);
    setEditorOpen(true);
  };

  const handleLogout = async () => {
    await logoutEditor().catch(() => undefined);
    setIsEditor(false);
    setEditorOpen(false);
  };

  const activeProject =
    route.page === 'project-detail' && content
      ? content.projects.find(
          (p) => p.slug === route.slug || p.id === route.slug
        )
      : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f9fe] text-[#0a1d37]">
      <Navbar currentPage={route.page} onNavigate={navigate} />

      {isEditor && (
        <div className="bg-[#0a1d37] text-white border-b border-[#1e3a8a]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-[#93c5fd]">
              Mode Editor Aktif — Anda dapat mengubah beranda, proyek,
              dokumentasi, dan halaman tentang.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenEditorTab('landing')}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-[#1d4ed8] hover:bg-[#2563eb] font-semibold text-white transition-colors"
              >
                <Settings2 className="w-3.5 h-3.5" aria-hidden="true" />
                Buka Panel Editor
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1 rounded-[2px] bg-white/10 hover:bg-white/20 font-medium text-white transition-colors"
              >
                Keluar Editor
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {loading && (
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-20 text-center space-y-3">
            <div className="w-8 h-8 mx-auto rounded-full border-2 border-[#1d4ed8] border-t-transparent animate-spin" />
            <p className="text-sm font-medium text-[#456084]">
              Memuat pusat digital VECTOR...
            </p>
          </div>
        )}

        {!loading && loadError && (
          <div className="max-w-lg mx-auto px-4 py-20 text-center space-y-4">
            <h1 className="text-xl font-bold text-[#0a1d37]">
              Gagal Memuat Konten
            </h1>
            <p className="text-sm text-[#456084]">{loadError}</p>
            <button
              type="button"
              onClick={() => void loadInitialData()}
              className="px-4 py-2.5 rounded-[3px] text-xs font-semibold text-white btn-tactile"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !loadError && content && (
          <>
            {route.page === 'home' && (
              <HomePage
                content={content}
                isEditor={isEditor}
                onNavigate={navigate}
                onOpenEditor={handleOpenEditorTab}
              />
            )}
            {route.page === 'projects' && (
              <ProjectsPage
                projects={content.projects}
                isEditor={isEditor}
                onNavigate={navigate}
                onOpenEditor={handleOpenEditorTab}
              />
            )}
            {route.page === 'project-detail' && (
              <ProjectDetailPage
                project={activeProject}
                isEditor={isEditor}
                onNavigate={navigate}
                onOpenEditor={handleOpenEditorTab}
              />
            )}
            {route.page === 'documentation' && (
              <DocumentationPage
                documentation={content.documentation}
                isEditor={isEditor}
                onOpenEditor={handleOpenEditorTab}
              />
            )}
            {route.page === 'about' && (
              <AboutPage
                about={content.about}
                isEditor={isEditor}
                onNavigate={navigate}
                onOpenEditor={handleOpenEditorTab}
              />
            )}
          </>
        )}
      </main>

      <Footer
        onNavigate={navigate}
        organizationName={content?.about.organizationName}
        chairpersonName={content?.about.chairpersonName}
        footerDescription={content?.about.footerDescription}
        workProgramPdfUrl={content?.about.workProgramPdfUrl}
      />

      {/* Tombol editor sudut kanan bawah */}
      <button
        type="button"
        onClick={handlePencilClick}
        aria-label={isEditor ? 'Buka Ruang Editor' : 'Buka Mode Editor'}
        title={isEditor ? 'Buka Ruang Editor' : 'Mode Editor'}
        className={`fixed bottom-5 right-5 z-40 w-11 h-11 rounded-[3px] flex items-center justify-center transition-transform duration-150 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8] ${
          isEditor
            ? 'btn-tactile text-white'
            : 'btn-tactile-secondary text-[#334e73] hover:text-[#1d4ed8]'
        }`}
      >
        <Pencil className="w-4 h-4" aria-hidden="true" />
      </button>

      <PinAuthModal
        open={pinModalOpen}
        onClose={() => setPinModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />

      {editorOpen && isEditor && content && (
        <EditorWorkspace
          open={editorOpen}
          initialTab={editorTab}
          content={content}
          onClose={() => setEditorOpen(false)}
          onContentUpdated={(next) => setContent(next)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
