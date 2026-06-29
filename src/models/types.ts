export interface Project {
  id: number;
  title: string;
  category: 'commercial' | 'documentary' | 'music' | 'corporate' | 'short';
  youtubeUrl: string;
  videoId: string;
  client: string;
  duration: string;
  year: string;
  description: string;
  software: string[];
  role: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface PortfolioOwner {
  name: string;
  title: string;
  bio: string;
  experience: number;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}
