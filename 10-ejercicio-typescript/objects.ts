/* Aquí deberás definir los tipos para los objetos Job, Company y Candidate */

import type { ExperienceLevel, WorkMode, Technology } from './types.ts'

export type Job = {
  id: string
  title: string
  company: string
  location: string
  description: string
  salary?: number // Opcional
  technologies: Technology[]
  experienceLevel: ExperienceLevel
  workMode: WorkMode
  isActive: boolean
  postedDate: Date
}

export type Company = {
  id: string
  name: string
  description: string
  website?: string
  employees: number
  foundedYear: number
}

export type Candidate = {
  id: string
  name: string
  email: string
  phone?: string
  skills: Technology[]
  experienceYears: number
  resume?: string
}
