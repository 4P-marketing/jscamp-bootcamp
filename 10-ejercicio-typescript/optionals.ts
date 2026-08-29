/* Aquí deberás tipar los parámetros y el valor de retorno de las funciones, teniendo en cuenta que existen parámetros opcionales y valores por defecto */

import {
  searchJobs,
  filterByExperience,
  filterByTechnology,
  filterByMinSalary,
} from './functions.ts'

// Función de búsqueda avanzada con opcionales
export function advancedSearch(jobs: any[], options: any): any[] {
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
export function getRecentJobs(jobs: any[], days: any): any[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return jobs.filter((job) => job.postedDate >= cutoffDate)
}
