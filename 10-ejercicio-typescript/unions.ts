/* Aquí deberás tipar las funciones con los tipos ya creados. Teniendo en cuenta que el tipo SearchResult es un union type que puede ser:

- { success: true; jobs: Job[]; count: number }
- { success: false; error: string }

Tendrás que tipar la función safeSearch y displaySearchResults, verificando que la lógica de la función sea correcta o hay algún error.
*/

import { searchJobs } from './functions.ts'

export type SearchResult = any

// Función que devuelve SearchResult
export function safeSearch(jobs: any[], searchTerm: any): SearchResult {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return {
      success: false,
      error: 'El término de búsqueda no puede estar vacío',
    }
  }

  const results = searchJobs(jobs, searchTerm)

  return {
    success: true,
    jobs: results,
    count: results.length,
  }
}

// Función para mostrar resultados usando type narrowing
export function displaySearchResults(result: SearchResult): void {
  if (result.succes) {
    console.log(`Encontrados ${result.count} empleos:`)
    result.jobs.forEach((job: any) => {
      console.log(`- ${job.title} en ${job.company}`)
    })
  } else {
    console.error(`Error: ${result.error}`)
  }
}
