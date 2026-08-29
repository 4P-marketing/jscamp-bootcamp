/* En este ejercicio deberás tipar las tuplas con los tipos ya creados, y usando `number` para la tupla de `SalaryRange` y `Coordinates` */

// Tupla para coordenadas de ubicación
export type Coordinates = [any, any] // [latitud, longitud]

// Tupla para rango de salario
export type SalaryRange = [any, any] // [mínimo, máximo]

// Función que devuelve el rango de salarios
export function getSalaryRange(jobs: any[]): SalaryRange {
  const salaries = jobs.filter((job) => job.salary !== undefined).map((job) => job.salary as any)

  if (salaries.length === 0) {
    return [0, 0]
  }

  const min = Math.min(...salaries)
  const max = Math.max(...salaries)

  return [min, max]
}
