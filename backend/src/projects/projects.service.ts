import { Injectable } from '@nestjs/common';

// Hardcoded project data — can be migrated to Supabase later
const projects = [
  {
    id: 1,
    icon: '/assets/logo/VisiTrack_logo.png',
    title: 'VisiTrack',
    description: 'A visitor tracking system designed to organize entries, exits, and records efficiently.',
    fullDescription:
      'VisiTrack helps manage visitor data by recording entries in a structured and reliable way. It focuses on accuracy, accountability, and ease of use, making manual tracking less chaotic.',
    tech: ['Outsystems'],
    features: [
      'Visitor logging system',
      'Organized record management',
      'Simple and clean interface',
      'Error-reducing input flow',
    ],
  },
  {
    id: 2,
    icon: '/assets/logo/Contextufile_logo.png',
    title: 'ContextuFile',
    description: 'An intelligent file organization system that understands what your files are about.',
    fullDescription:
      "ContextuFile uses contextual meaning from file titles to automatically organize files into folders. Instead of manual sorting, the system analyzes keywords and intent to reduce clutter.",
    tech: ['Python', 'spaCy', 'HTML', 'JavaScript', 'CSS'],
    features: [
      'Context-based file classification',
      'Automated folder organization',
      'NLP-powered logic',
      'Scalable system design',
    ],
  },
  {
    id: 3,
    icon: '/assets/logo/ArisePH_logo.png',
    title: 'ARISE PH Database',
    description: 'A centralized database system designed for structured data management.',
    fullDescription:
      'ARISE PH Database focuses on data integrity, organization, and efficient retrieval. It was designed to support real-world use cases that require reliable records and reporting.',
    tech: ['Workbook', 'Frappe'],
    features: [
      'Centralized data storage',
      'Structured relationships',
      'Secure and consistent records',
      'Query-based reporting',
    ],
  },
  {
    id: 4,
    icon: '/assets/logo/Portfolio_logo.png',
    title: 'Web Portfolio (Yes, This One)',
    description: "A fully personalized portfolio built from scratch—no templates, just vibes.",
    fullDescription:
      'This website was designed and coded to reflect my personality, interests, and skills. Inspired by underwater glass aesthetics, it focuses on smooth motion, playful interactions, and clarity.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    features: [
      'Custom design from scratch',
      'Interactive animations',
      'Responsive layout',
      'Themed UI experience',
    ],
  },
];

@Injectable()
export class ProjectsService {
  findAll() {
    return projects;
  }

  findOne(id: number) {
    return projects.find((p) => p.id === id) || null;
  }
}
