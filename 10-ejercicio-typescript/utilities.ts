/* En este ejercicio deberás tipar las funciones con los tipos ya creados, y usar `Partial` y `Readonly` en cada caso. */

export function updateJob(job: any, updates: Partial<any>): any {
  return { ...job, ...updates }
}

export type JobSummary = any

export function getJobSummaries(jobs: any[]): JobSummary[] {
  return jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
  }))
}

export type ReadonlyJob = any

export function displayJob(job: ReadonlyJob): void {
  console.log(`${job.title} - ${job.company}`)
  job.title = 'Nuevo título'
}
