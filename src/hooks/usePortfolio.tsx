import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { projects as defaultProjects, portfolioOwner as defaultOwner, skills as defaultSkills, processSteps as defaultProcess } from '../models/portfolio';
import { fetchPublishedData, publishToGitHub, type PortfolioData } from './usePublish';
import type { Project, PortfolioOwner, Skill, ProcessStep } from '../models/types';

interface PortfolioDataCtx {
  projects: Project[];
  portfolioOwner: PortfolioOwner;
  skills: Skill[];
  processSteps: ProcessStep[];
  isLoaded: boolean;
  updateProjects: (projects: Project[]) => void;
  updateOwner: (owner: PortfolioOwner) => void;
  updateSkills: (skills: Skill[]) => void;
  updateProcessSteps: (steps: ProcessStep[]) => void;
  resetAll: () => void;
  publish: () => Promise<{ success: boolean; error?: string }>;
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

const PortfolioContext = createContext<PortfolioDataCtx | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolioOwner, setPortfolioOwner] = useState<PortfolioOwner>(defaultOwner);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(defaultProcess);
  const [isLoaded, setIsLoaded] = useState(false);

  // On mount: load published data (data.json) for ALL visitors
  // If admin has localStorage data, that takes priority (admin's latest draft)
  useEffect(() => {
    async function loadData() {
      const stored = loadFromStorage();

      // If admin has local draft data, use it (their latest unpublished changes)
      if (stored?.projects && Array.isArray(stored.projects) && stored.projects.length > 0) {
        setProjects(stored.projects);
        if (stored.portfolioOwner) setPortfolioOwner(stored.portfolioOwner);
        if (stored.skills) setSkills(stored.skills);
        if (stored.processSteps) setProcessSteps(stored.processSteps);
        setIsLoaded(true);
        return;
      }

      // No local data — fetch the shared published data
      const published = await fetchPublishedData();
      if (published) {
        setProjects(published.projects as Project[]);
        if (published.portfolioOwner) setPortfolioOwner(published.portfolioOwner as PortfolioOwner);
        if (published.skills) setSkills(published.skills as Skill[]);
        if (published.processSteps) setProcessSteps(published.processSteps as ProcessStep[]);
        // Also save to localStorage as cache
        saveToStorage(published);
      } else {
        // No published data either — use hardcoded defaults
        setProjects(defaultProjects);
        setPortfolioOwner(defaultOwner);
        setSkills(defaultSkills);
        setProcessSteps(defaultProcess);
      }
      setIsLoaded(true);
    }
    loadData();
  }, []);

  const updateProjects = useCallback((p: Project[]) => { setProjects(p); saveToStorage({ projects: p }); }, []);
  const updateOwner = useCallback((o: PortfolioOwner) => { setPortfolioOwner(o); saveToStorage({ portfolioOwner: o }); }, []);
  const updateSkills = useCallback((s: Skill[]) => { setSkills(s); saveToStorage({ skills: s }); }, []);
  const updateProcessSteps = useCallback((s: ProcessStep[]) => { setProcessSteps(s); saveToStorage({ processSteps: s }); }, []);

  const resetAll = useCallback(() => {
    setProjects(defaultProjects);
    setPortfolioOwner(defaultOwner);
    setSkills(defaultSkills);
    setProcessSteps(defaultProcess);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Publish current data to GitHub → all visitors will see it
  const publish = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    const data: PortfolioData = {
      projects,
      portfolioOwner,
      skills,
      processSteps,
    };
    return publishToGitHub(data);
  }, [projects, portfolioOwner, skills, processSteps]);

  return (
    <PortfolioContext.Provider value={{
      projects, portfolioOwner, skills, processSteps, isLoaded,
      updateProjects, updateOwner, updateSkills, updateProcessSteps, resetAll, publish,
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
