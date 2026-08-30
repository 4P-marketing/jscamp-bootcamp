// ================================
// TIPOS PARA LA API EXPRESS
// ================================

// ================================
// ENTIDADES
// ================================

export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  data: JobData
  content?: JobContent
}

export interface JobData {
  technology: string[]
  modality: 'remote' | 'onsite' | 'hybrid'
  level: 'junior' | 'mid' | 'senior'
}

export interface JobContent {
  description: string
  responsibilities: string
  requirements: string
  about: string
}

// ================================
// DTOs
// ================================

// Para crear - sin id
export type CreateJobDTO = Omit<Job, 'id'>

// Para actualizar - todo opcional
export type UpdateJobDTO = Partial<CreateJobDTO>

// ================================
// FILTROS
// ================================

export interface JobFilters {
  tech?: string
  modality?: JobData['modality']
  level?: JobData['level']
}

// ================================
// RESPUESTAS DE API
// ================================

export interface ApiError {
  message: string
  errors?: unknown[]
}
