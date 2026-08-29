import { jobs, candidates } from './arrays.ts'
import { filterByExperience, searchJobs } from './functions.ts'
import { isQualified, formatSalary } from './narrowing.ts'
import { getSalaryRange } from './tuples.ts'
import { safeSearch, displaySearchResults } from './unions.ts'
import { getJobSummaries } from './utilities.ts'

console.log('=== Sistema de Gestión de Empleos ===\n')
console.log('Total de empleos:', jobs.length)

const searchResults = searchJobs(jobs, 'developer')
console.log('Empleos encontrados con "developer":', searchResults.length)

const seniorJobs = filterByExperience(jobs, 'senior')
console.log('Empleos senior:', seniorJobs.length)

if (jobs.length > 0 && candidates.length > 0) {
  const qualified = isQualified(candidates[0], jobs[0])
  console.log(`¿${candidates[0].name} está cualificado para ${jobs[0].title}?`, qualified)
}

const [minSalary, maxSalary] = getSalaryRange(jobs)
console.log(`Rango salarial: ${formatSalary(minSalary)} - ${formatSalary(maxSalary)}`)

// Probar búsqueda segura
const searchResult = safeSearch(jobs, 'react')
displaySearchResults(searchResult)

// Probar resúmenes de empleos
const summaries = getJobSummaries(jobs)
console.log('\nResúmenes de empleos:')
summaries.forEach((summary) => {
  console.log(`- ${summary.title} en ${summary.company} (${summary.location})`)
})

console.log('\n✅ Ejercicio completado!')
