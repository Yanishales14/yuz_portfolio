import { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PortfolioProvider } from './hooks/usePortfolio';
import { LoadingScreen } from './components/LoadingScreen';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { FilmStrip } from './components/FilmStrip';
import { About } from './components/About';
import { Stats } from './components/Stats';
import { EditingProcess } from './components/EditingProcess';
import { BeforeAfter } from './components/BeforeAfter';
import { Contact } from './components/Contact';
import { CursorGlow } from './components/CursorGlow';
import { FloatingElements } from './components/FloatingElements';
import { ScrollProgress } from './components/ScrollProgress';
import { AdminLogin, AdminPanel } from './components/Admin';
import { useAdminAuth } from './hooks/useAdminAuth';

function PortfolioSite() {
  const [isLoading, setIsLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    document.body.style.overflow = '';
    setTimeout(() => setReady(true), 100);
  }, []);

  if (isLoading) {
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
  }

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatePresence>{isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}</AnimatePresence>
      <CursorGlow />
      <FloatingElements />
      {!isLoading && <ScrollProgress />}
      <Navigation show={!isLoading} />
      <main>
        <Hero ready={ready} />
        <FilmStrip />
        <ProjectGrid />
        <Stats />
        <About />
        <EditingProcess />
        <BeforeAfter />
        <Contact />
      </main>
    </div>
  );
}

function AdminRoute() {
  const { isAuthenticated, login, logout } = useAdminAuth();
  const navigate = useNavigate();
  if (!isAuthenticated) return <AdminLogin onLogin={login} />;
  return <AdminPanel onBack={() => navigate('/')} />;
}

export default function App() {
  return (
    <PortfolioProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<PortfolioSite />} />
          <Route path="/admin" element={<AdminRoute />} />
        </Routes>
      </HashRouter>
    </PortfolioProvider>
  );
}
