/* Aquí deberás usar los tipos creados en los ejercicios anteriores para definir los tipos de los parámetros y el valor de retorno de las funciones */

import type { ExperienceLevel, Technology } from './types.ts'
import type { Job } from './objects.ts'

export function filterByExperience(jobs: Job[], level: ExperienceLevel): Job[] {
  return jobs.filter((job) => job.experienceLevel === level)
}

// Función para filtrar por tecnología
export function filterByTechnology(jobs: Job[], tech: Technology): Job[] {
  return jobs.filter((job) => job.technologies.includes(tech.toLowerCase() as Technology))
}

// Función para filtrar por salario mínimo
export function filterByMinSalary(jobs: Job[], minSalary: number): Job[] {
  return jobs.filter((job) => job.salary !== undefined && job.salary >= minSalary)
}

// Función para buscar por texto
export function searchJobs(jobs: Job[], searchTerm: string): Job[] {
  const term = searchTerm.toLowerCase()
  return jobs.filter(
    (job) => job.title.toLowerCase().includes(term) || job.description.toLowerCase().includes(term)
  )
}
