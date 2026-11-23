export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectArchitectureLayer {
  name: string;
  items: string[];
}

export interface Project {
  slug: string;
  title: string;
  category: "Full-stack" | "Microservices & .NET" | "E-Commerce & SaaS" | "Realtime & System";
  shortDescription: string;
  description: string;
  problem: string;
  solution: string;
  role: string;
  technologies: string[];
  features: string[];
  metrics?: ProjectMetric[];
  architecture?: {
    summary: string;
    layers: ProjectArchitectureLayer[];
  };
  screenshots: string[];
  demoUrl?: string;
  githubUrl?: string;
  year: string;
  status: "completed" | "in-progress";
  featured: boolean;
}

export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  type: string;
  description: string;
  highlights: string[];
  technologies: string[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  project: string;
  content: string;
  rating: number;
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
