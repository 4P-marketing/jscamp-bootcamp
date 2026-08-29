/* Aquí deberás definir los tipos Job y Candidate creados en objects.ts para los arrays dados */

export const jobs = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'Tech Corp',
    location: 'Madrid',
    description: 'Buscamos desarrollador frontend con experiencia en React',
    salary: 45000,
    technologies: ['react', 'typescript', 'tailwind'],
    experienceLevel: 'mid',
    workMode: 'hibrido',
    isActive: true,
    postedDate: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: 'StartupXYZ',
    location: 'Barcelona',
    description: 'Buscamos desarrollador backend con experiencia en Node.js',
    salary: 55000,
    technologies: ['node', 'python', 'javascript'],
    experienceLevel: 'senior',
    workMode: 'remoto',
    isActive: true,
    postedDate: new Date('2024-01-20'),
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'Digital Agency',
    location: 'Valencia',
    description: 'Buscamos desarrollador full stack para proyecto e-commerce',
    salary: 40000,
    technologies: ['react', 'node', 'typescript', 'javascript'],
    experienceLevel: 'mid',
    workMode: 'presencial',
    isActive: true,
    postedDate: new Date('2024-01-25'),
  },
]

export const companies = [
  {
    id: '1',
    name: 'Midudev S.A',
    description: 'Empresa de desarrollo de software',
    website: 'https://midu.dev',
    employees: 10,
    foundedYear: 2026,
  },
  {
    id: '2',
    name: 'Tech Corp',
    description: 'Empresa de desarrollo de software',
    website: 'https://techcorp.com',
    employees: 20,
    foundedYear: 2025,
  },
  {
    id: '3',
    name: 'StartupXYZ',
    description: 'Empresa de desarrollo de software',
    website: 'https://startupxyz.com',
    employees: 15,
    foundedYear: 2024,
  },
]

export const candidates = [
  {
    id: '1',
    name: 'Ana García',
    email: 'ana@example.com',
    skills: ['react', 'javascript', 'css'],
    experienceYears: 3,
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    phone: '+34 600 123 456',
    skills: ['node', 'python', 'typescript'],
    experienceYears: 5,
  },
  {
    id: '3',
    name: 'María López',
    email: 'maria@example.com',
    skills: ['react', 'typescript', 'tailwind', 'node'],
    experienceYears: 4,
  },
]
