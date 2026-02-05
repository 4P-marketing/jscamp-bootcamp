import jobs from '../jobs.json' with { type: 'json' }
import { DEFAULTS } from '../config.js'

const UBICACION_TO_MODALIDAD = {
  'remoto': 'remoto',
  'ciudad de méxico': 'cdmx',
  'guadalajara': 'guadalajara',
  'barcelona': 'barcelona',
  'buenos aires': 'bsas',
  'madrid': 'madrid',
  'valencia': 'valencia',
  'bogotá': 'bogota',
  'lima': 'lima',
  'santiago de chile': 'santiago',
  'monterrey': 'monterrey'
}

export class JobModel {
  static async getAll({ text, title, level, limit = DEFAULTS.LIMIT_PAGINATION, technology, offset = DEFAULTS.LIMIT_OFFSET }) {
    let filteredJobs = jobs
    
    if (text) {
      const searchTerm = text.toLowerCase()
      filteredJobs = filteredJobs.filter(job =>
        job.titulo.toLowerCase().includes(searchTerm) || 
        job.descripcion.toLowerCase().includes(searchTerm)
      )
    }

    if (title) {
      const titleTerm = title.toLowerCase()
      filteredJobs = filteredJobs.filter(job =>
        job.titulo.toLowerCase().includes(titleTerm)
      )
    }

    if (technology) {
      const techTerm = technology.toLowerCase()
      filteredJobs = filteredJobs.filter(job =>
        job.data?.technology?.includes(techTerm)
      )
    }

    if (level) {
      const levelTerm = level.toLowerCase()
      filteredJobs = filteredJobs.filter(job =>
        job.data?.nivel?.toLowerCase() === levelTerm
      )
    }

    const limitNumber = Number(limit) 
    const offsetNumber = Number(offset)

    const total = filteredJobs.length
    const paginatedJobs = filteredJobs.slice(offsetNumber, offsetNumber + limitNumber)

    return { jobs: paginatedJobs, total }
  }

  static async getById(id) {
    const job = jobs.find(job => job.id === id)
    return job
  }

  static async create ({ titulo, empresa, ubicacion, descripcion, data, content }) {
    let finalData = data
    if (ubicacion && (!data?.modalidad)) {
      const modalidad = UBICACION_TO_MODALIDAD[ubicacion.toLowerCase()]
      if (modalidad) {
        finalData = {
          ...data,
          modalidad
        }
      }
    }

    const newJob = {
      id: crypto.randomUUID(),
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data: finalData,
      content
    }

    jobs.push(newJob)

    return newJob
  }

  static #updateJob(id, updateFn) {
    const jobIndex = jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) {
      return null
    }

    const updatedJob = updateFn(jobs[jobIndex])
    jobs[jobIndex] = updatedJob

    return updatedJob
  }

  static async update(id, { titulo, empresa, ubicacion, descripcion, data, content }) {
    return this.#updateJob(id, (job) => ({
      ...job,
      titulo,
      empresa,
      ubicacion,
      descripcion,
      data,
      content
    }))
  }

  static async partialUpdate(id, { titulo, empresa, ubicacion, descripcion, data, content }) {
    return this.#updateJob(id, (job) => ({
      ...job,
      titulo: titulo ?? job.titulo,
      empresa: empresa ?? job.empresa,
      ubicacion: ubicacion ?? job.ubicacion,
      descripcion: descripcion ?? job.descripcion,
      data: data ?? job.data,
      content: content ?? job.content
    }))
  }


  static async delete(id) {
    const jobIndex = jobs.findIndex(job => job.id === id)
    if (jobIndex === -1) {
      return false
    }

    jobs.splice(jobIndex, 1)
    return true
  }
}