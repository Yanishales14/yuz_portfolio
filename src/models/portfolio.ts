import type { Project, PortfolioOwner, Skill, ProcessStep } from './types';

export const portfolioOwner: PortfolioOwner = {
  name: 'YUZ',
  title: 'Video Editor & Storyteller',
  bio: 'Award-winning video editor specializing in commercials, documentaries, and music videos. Crafting visual stories that captivate audiences worldwide.',
  experience: 8,
};

export const projects: Project[] = [
  {
    id: 1,
    title: 'Nike — Move to Zero',
    category: 'commercial',
    videoUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=450&fit=crop',
    client: 'Nike',
    duration: '1:30',
    year: '2024',
    description: 'A high-energy commercial spot for Nike\'s sustainability initiative. Dynamic cuts, color grading, and sound design that drives the message home.',
    software: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    role: 'Lead Editor',
  },
  {
    id: 2,
    title: 'Voices of the City',
    category: 'documentary',
    videoUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=450&fit=crop',
    client: 'Independent',
    duration: '12:45',
    year: '2024',
    description: 'A documentary exploring urban life through the lens of everyday people. Emotional storytelling with cinematic color grading.',
    software: ['Premiere Pro', 'DaVinci Resolve'],
    role: 'Editor & Colorist',
  },
  {
    id: 3,
    title: 'Neon Dreams — Music Video',
    category: 'music',
    videoUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=450&fit=crop',
    client: 'Neon Dreams',
    duration: '3:45',
    year: '2023',
    description: 'A visually stunning music video with neon-lit sequences and rhythmic cuts that sync perfectly with the beat.',
    software: ['Premiere Pro', 'After Effects', 'Blender'],
    role: 'Editor & VFX',
  },
  {
    id: 4,
    title: 'TechCorp Annual Summit',
    category: 'corporate',
    videoUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=450&fit=crop',
    client: 'TechCorp',
    duration: '5:20',
    year: '2023',
    description: 'Event highlight reel for a major tech conference. Clean, professional editing with engaging motion graphics.',
    software: ['Premiere Pro', 'After Effects'],
    role: 'Editor',
  },
  {
    id: 5,
    title: 'The Last Frame',
    category: 'short',
    videoUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop',
    client: 'Independent',
    duration: '8:30',
    year: '2024',
    description: 'An award-winning short film about a photographer discovering the last frame on an old roll of film. Atmospheric and deeply personal.',
    software: ['Premiere Pro', 'DaVinci Resolve', 'Photoshop'],
    role: 'Editor & Colorist',
  },
  {
    id: 6,
    title: 'Adidas — Create the Future',
    category: 'commercial',
    videoUrl: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
    client: 'Adidas',
    duration: '2:00',
    year: '2023',
    description: 'A bold commercial for Adidas featuring rapid-fire edits, split screens, and dynamic transitions that embody the brand\'s energy.',
    software: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    role: 'Lead Editor',
  },
];

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
