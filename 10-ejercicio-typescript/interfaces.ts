/* En este archivo deberás tipar las interfaces de los servicios de búsqueda y aplicación a empleo */

import {
  filterByExperience,
  filterByMinSalary,
  filterByTechnology,
  searchJobs,
} from './functions.ts'
import type { ApplicationStatus, ExperienceLevel, Technology } from './types.ts'
import type { Job } from './objects.ts'

// Interface para servicios de búsqueda
export interface JobSearchService {
  searchJobs: (jobs: Job[], searchTerm: string) => Job[]
  filterByExperience: (jobs: Job[], level: ExperienceLevel) => Job[]
  filterByMinSalary: (jobs: Job[], minSalary: number) => Job[]
  filterByTechnology: (jobs: Job[], tech: Technology) => Job[]
}

export const searchService: JobSearchService = {
  searchJobs,
  filterByExperience,
  filterByMinSalary,
  filterByTechnology,
}

// Interface para aplicación a empleo
export interface JobApplication {
  id: string
  jobId: string
  candidateId: string
  status: ApplicationStatus
  appliedDate: Date
  coverLetter?: string
}

// Interface que extiende Job con propiedades adicionales
export interface DetailedJob extends Job {
  benefits: string[]
  requirements: string[]
  applicationDeadline?: Date
}
