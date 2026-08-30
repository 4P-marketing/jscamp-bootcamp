/* En este ejercicio deberás tipar las funciones con los tipos ya creados, y usar `Partial` y `Readonly` en cada caso. */

import type { Job } from './objects.ts'

export function updateJob(job: Job, updates: Partial<Job>): Job {
  return { ...job, ...updates }
}

export type JobSummary = Pick<Job, 'id' | 'title' | 'company' | 'location'>

export function getJobSummaries(jobs: Job[]): JobSummary[] {
  return jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
  }))
}

export type ReadonlyJob = Readonly<Job>

export function displayJob(job: ReadonlyJob): void {
  console.log(`${job.title} - ${job.company}`)
}
