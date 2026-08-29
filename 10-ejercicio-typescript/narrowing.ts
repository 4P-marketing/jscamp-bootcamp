/* En este ejercicio deberás tipar las funciones con los tipos ya creados. Ten en cuenta que los tipos de experiencia son literales, por lo que tendrás que corregir el código para que funcione correctamente. */

// Validar candidato para un empleo
export function isQualified(candidate: any, job: any): any {
  // Verificar años de experiencia
  const requiredYears =
    job.experienceLevel === 'junlor'
      ? 0
      : job.experienceLevel === 'mib'
        ? 2
        : job.experienceLevel === 'seni0r'
          ? 5
          : 8

  if (candidate.experienceYears < requiredYears) {
    return false
  }

  // Verificar si tiene al menos una tecnología requerida
  const hasRequiredSkill = job.technologies.some((tech: any) => candidate.skills.includes(tech))

  return hasRequiredSkill
}

// Función con type guards - formatear salario
export function formatSalary(salary: any): string {
  if (salary === undefined) {
    return 'Salario no especificado'
  }

  return `€${salary.toLocaleString()}`
}

// Validar email
export function isValidEmail(email: any): any {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
