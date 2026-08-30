/* Aquí deberás tipar los parámetros y el valor de retorno de las funciones, teniendo en cuenta que existen parámetros opcionales y valores por defecto */

import {
  searchJobs,
  filterByExperience,
  filterByTechnology,
  filterByMinSalary,
} from './functions.ts'
import type { ExperienceLevel, WorkMode, Technology } from './types.ts'
import type { Job } from './objects.ts'

type SearchOptions = {
  text?: string
  level?: ExperienceLevel
  technology?: Technology
  minSalary?: number
  workMode?: WorkMode
}

// Función de búsqueda avanzada con opcionales
export function advancedSearch(jobs: Job[], options: SearchOptions): Job[] {
  let results = jobs

  if (options.text) {
    results = searchJobs(results, options.text)
  }

  if (options.level) {
    results = filterByExperience(results, options.level)
  }

  if (options.technology) {
    results = filterByTechnology(results, options.technology)
  }

  if (options.minSalary) {
    results = filterByMinSalary(results, options.minSalary)
  }

  if (options.workMode) {
    results = results.filter((job) => job.workMode === options.workMode)
  }

  return results
}

// Función con valores por defecto
export function getRecentJobs(jobs: Job[], days: number = 30): Job[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return jobs.filter((job) => job.postedDate >= cutoffDate)
}
