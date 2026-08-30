import crypto from 'node:crypto'
import { db } from '../db/database'

import type { Job, JobData, JobContent, CreateJobDTO, UpdateJobDTO, JobFilters } from '../types'

interface JobRow {
  id: string
  title: string
  company: string
  location: string
  description: string
  modality: JobData['modality']
  level: JobData['level']
  technologies: string
}

export class JobModel {
  // Obtener todos los jobs con filtros opcionales
  static async getAll(filters?: JobFilters): Promise<Job[]> {
    let query = `
      SELECT j.*, GROUP_CONCAT(jt.technology) AS technologies
      FROM jobs j
      JOIN job_technologies jt ON j.id = jt.job_id
    `

    const conditions: string[] = []
    const params: unknown[] = []

    if (filters?.tech) {
      conditions.push('jt.technology = ?')
      params.push(filters.tech)
    }

    if (filters?.modality) {
      conditions.push('j.modality = ?')
      params.push(filters.modality)
    }

    if (filters?.level) {
      conditions.push('j.level = ?')
      params.push(filters.level)
    }

    if (conditions.length > 0) {
      query += 'WHERE ' + conditions.join(' AND ')
    }

    query += ' GROUP BY j.id'

    if (filters?.limit) {
      query += ' LIMIT ?'
      params.push(Number(filters.limit))

      if (filters?.offset) {
        query += ' OFFSET ?'
        params.push(Number(filters.offset))
      }
    }

    const rows = db.prepare(query).all(...params) as JobRow[]

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      description: row.description,
      data: {
        technology: row.technologies.split(','),
        modality: row.modality,
        level: row.level
      }
    }))
  }

  // Obtener un job por ID
  static async getById(id: string): Promise<Job | undefined> {
    const row = db.prepare(`
      SELECT j.*, GROUP_CONCAT(jt.technology) AS technologies
      FROM jobs j
      JOIN job_technologies jt ON j.id = jt.job_id
      WHERE j.id = ?
      GROUP BY j.id
    `).get(id) as JobRow | undefined

    if (!row) 
      return

    const content = db.prepare(`
      SELECT description, responsibilities, requirements, about
      FROM job_content
      WHERE job_id = ?
    `).get(id) as JobContent | undefined

    return {
      id: row.id,
      title: row.title,
      company: row.company,
      location: row.location,
      description: row.description,
      data: {
        technology: row.technologies.split(','),
        modality: row.modality,
        level: row.level
      },
      content
    }
  }

  // Crear un nuevo job
  static async create(input: CreateJobDTO): Promise<Job> {
    const newJob: Job = {
      id: crypto.randomUUID(),
      ...input
    }

    db.prepare(`
      INSERT INTO jobs (id, title, company, location, description, modality, level)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      newJob.id, 
      newJob.title, 
      newJob.company, 
      newJob.location, 
      newJob.description, 
      newJob.data.modality, 
      newJob.data.level
    )

    const insertTechnology = db.prepare('INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)')

    newJob.data.technology.forEach(technology => {
      insertTechnology.run(newJob.id, technology)
    })

    if (newJob.content) {
      db.prepare(`
        INSERT INTO job_content (job_id, description, id, responsibilities, requirements, about)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        newJob.id,
        newJob.content.description,
        crypto.randomUUID(),
        newJob.content.responsibilities,
        newJob.content.requirements, 
        newJob.content.about
      )
    }

    return newJob
  }

  // Eliminar un job
  static async delete(id: string): Promise<boolean> {
    const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(id)
    return result.changes > 0
  }

  // Actualizar un job
  static async update(id: string, input: UpdateJobDTO): Promise<Job | null> {
    const currentJob = await JobModel.getById(id)
    
    if (!currentJob) 
      return null

    const updatedJob: Job = {
      ...currentJob,
      ...input,
      data: input.data
        ? { ...currentJob.data, ...input.data }
        : currentJob.data
    }

    db.prepare(`
      UPDATE jobs
      SET title = ?, company = ?, location = ?, description = ?, modality = ?, level = ?
      WHERE id = ?
    `).run(
      updatedJob.title, 
      updatedJob.company, 
      updatedJob.location, 
      updatedJob.description, 
      updatedJob.data.modality, 
      updatedJob.data.level, id
    )

    if (input.data) {
      db.prepare('DELETE FROM job_technologies WHERE job_id = ?').run(id)

      const insertTechnology = db.prepare('INSERT INTO job_technologies (job_id, technology) VALUES (?, ?)')

      updatedJob.data.technology.forEach(technology => {
        insertTechnology.run(id, technology)
      })
    }

    if (input.content) {
      db.prepare(`
        UPDATE job_content
        SET description = ?, responsibilities = ?, requirements = ?, about = ?
        WHERE job_id = ?
      `).run(
        input.content.description,
        input.content.responsibilities,
        input.content.requirements,
        input.content.about,
        id
      )
    }

    return updatedJob
  }
}
