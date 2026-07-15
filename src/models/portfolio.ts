import type { Project, PortfolioOwner, Skill, ProcessStep } from './types';

export const portfolioOwner: PortfolioOwner = {
  name: 'YUZ',
  title: 'Video Editor & Storyteller',
  bio: 'Award-winning video editor specializing in commercials, documentaries, and music videos. Crafting visual stories that captivate audiences worldwide.',
  experience: 8,
};

// NO demo projects — real projects come from data.json (shared via GitHub)
export const projects: Project[] = [];

export const skills: Skill[] = [
  { name: 'Premiere Pro', level: 95 },
  { name: 'DaVinci Resolve', level: 90 },
  { name: 'After Effects', level: 85 },
  { name: 'Photoshop', level: 88 },
  { name: 'Blender', level: 75 },
  { name: 'Color Grading', level: 92 },
];

export const processSteps: ProcessStep[] = [
  { number: '01', title: 'Discovery', description: 'Understanding your vision, audience, and the story you want to tell.', icon: 'search' },
  { number: '02', title: 'Assembly', description: 'Structuring the narrative with a rough cut. Finding the rhythm and emotional beats.', icon: 'layers' },
  { number: '03', title: 'Refinement', description: 'Precision editing — every cut, transition, and timing perfected.', icon: 'scissors' },
  { number: '04', title: 'Color & Sound', description: 'Professional color grading and audio mixing for a cinematic experience.', icon: 'palette' },
  { number: '05', title: 'Delivery', description: 'Final export optimized for every platform, from cinema to mobile.', icon: 'send' },
];

export const defaultAdminPassword = 'studio2024';
