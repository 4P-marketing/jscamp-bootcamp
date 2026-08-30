/* En este ejercicio deberás tipar las funciones con los tipos ya creados. Ten en cuenta que los tipos de experiencia son literales, por lo que tendrás que corregir el código para que funcione correctamente. */

import type { Job, Candidate } from './objects.ts'

// Validar candidato para un empleo
export function isQualified(candidate: Candidate, job: Job): boolean {
  // Verificar años de experiencia
  const requiredYears =
    job.experienceLevel === 'junior'
      ? 0
      : job.experienceLevel === 'mid'
        ? 2
        : job.experienceLevel === 'senior'
          ? 5
          : 8

  if (candidate.experienceYears < requiredYears) {
    return false
  }

  // Verificar si tiene al menos una tecnología requerida
  const hasRequiredSkill = job.technologies.some((tech) => candidate.skills.includes(tech))

  return hasRequiredSkill
}

// Función con type guards - formatear salario
export function formatSalary(salary?: number): string {
  if (salary === undefined) {
    return 'Salario no especificado'
  }

  return `€${salary.toLocaleString()}`
}

// Validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
