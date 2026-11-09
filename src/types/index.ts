export interface Project {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
  role: string;
  technologies: string[];
  features: string[];
  screenshots: string[];
  demoUrl?: string;
  githubUrl?: string;
  year: string;
  status: "completed" | "in-progress";
  featured: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
}

export interface TechCategory {
  category: string;
  items: string[];
}

export interface WorkStep {
  number: string;
  title: string;
  description: string;
}

export interface Profile {
  name: string;
  displayName: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  phone?: string;
  address?: string;
  mapEmbedUrl?: string;
  mapDirectionsUrl?: string;
  logo?: string;
  github: string;
  linkedin: string;
  avatar: string;
  available: boolean;
  location: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  message: string;
}
