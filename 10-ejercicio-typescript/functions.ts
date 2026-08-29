/* Aquí deberás usar los tipos creados en los ejercicios anteriores para definir los tipos de los parámetros y el valor de retorno de las funciones */

export function filterByExperience(jobs: any[], level: any) {
  return jobs.filter((job) => job.experienceLevel === level)
}

// Función para filtrar por tecnología
export function filterByTechnology(jobs: any[], tech: any) {
  return jobs.filter((job) => job.technologies.includes(tech.toLowerCase()))
}

// Función para filtrar por salario mínimo
export function filterByMinSalary(jobs: any[], minSalary: any) {
  return jobs.filter((job) => job.salary !== undefined && job.salary >= minSalary)
}

// Función para buscar por texto
export function searchJobs(jobs: any[], searchTerm: any) {
  const term = searchTerm.toLowerCase()
  return jobs.filter(
    (job) => job.title.toLowerCase().includes(term) || job.description.toLowerCase().includes(term)
  )
}
