import { useState, useCallback, type ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { projects as defaultProjects, portfolioOwner as defaultOwner, skills as defaultSkills, processSteps as defaultProcess, defaultShowreelVideoId } from '../models/portfolio';
import type { Project, PortfolioOwner, Skill, ProcessStep } from '../models/types';

interface PortfolioData {
  projects: Project[];
  portfolioOwner: PortfolioOwner;
  skills: Skill[];
  processSteps: ProcessStep[];
  showreelVideoUrl: string;
  showreelThumbnailUrl: string;
  updateProjects: (projects: Project[]) => void;
  updateOwner: (owner: PortfolioOwner) => void;
  updateSkills: (skills: Skill[]) => void;
  updateProcessSteps: (steps: ProcessStep[]) => void;
  updateShowreel: (videoUrl: string, thumbnailUrl: string) => void;
  resetAll: () => void;
}

const STORAGE_KEY = 'yuz_portfolio_data';

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function saveToStorage(data: Record<string, unknown>) {
  try {
    const current = loadFromStorage() || {};
    const merged = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch { /* ignore */ }
}

const PortfolioContext = createContext<PortfolioData | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const stored = loadFromStorage();

  const [projects, setProjects] = useState<Project[]>(stored?.projects || defaultProjects);
  const [portfolioOwner, setPortfolioOwner] = useState<PortfolioOwner>(stored?.portfolioOwner || defaultOwner);
  const [skills, setSkills] = useState<Skill[]>(stored?.skills || defaultSkills);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(stored?.processSteps || defaultProcess);
  const [showreelVideoUrl, setShowreelVideoUrl] = useState<string>(stored?.showreelVideoUrl || defaultShowreelVideoId || '');
  const [showreelThumbnailUrl, setShowreelThumbnailUrl] = useState<string>(stored?.showreelThumbnailUrl || '');

  const updateProjects = useCallback((p: Project[]) => { setProjects(p); saveToStorage({ projects: p }); }, []);
  const updateOwner = useCallback((o: PortfolioOwner) => { setPortfolioOwner(o); saveToStorage({ portfolioOwner: o }); }, []);
  const updateSkills = useCallback((s: Skill[]) => { setSkills(s); saveToStorage({ skills: s }); }, []);
  const updateProcessSteps = useCallback((s: ProcessStep[]) => { setProcessSteps(s); saveToStorage({ processSteps: s }); }, []);
  const updateShowreel = useCallback((videoUrl: string, thumbnailUrl: string) => {
    setShowreelVideoUrl(videoUrl);
    setShowreelThumbnailUrl(thumbnailUrl);
    saveToStorage({ showreelVideoUrl: videoUrl, showreelThumbnailUrl: thumbnailUrl });
  }, []);
  const resetAll = useCallback(() => {
    setProjects(defaultProjects);
    setPortfolioOwner(defaultOwner);
    setSkills(defaultSkills);
    setProcessSteps(defaultProcess);
    setShowreelVideoUrl(defaultShowreelVideoId || '');
    setShowreelThumbnailUrl('');
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <PortfolioContext.Provider value={{
      projects, portfolioOwner, skills, processSteps, showreelVideoUrl, showreelThumbnailUrl,
      updateProjects, updateOwner, updateSkills, updateProcessSteps, updateShowreel, resetAll,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
