/* Aquí irá tu código del segundo ejercicio */
import crypto from 'node:crypto'
import { db } from './database'
import jobs from '../jobs.json'

db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    modality TEXT NOT NULL CHECK (modality IN ('remote', 'onsite', 'hybrid')),
    level TEXT NOT NULL CHECK (level IN ('junior', 'mid', 'senior'))
  );

  CREATE TABLE IF NOT EXISTS job_technologies (
    job_id TEXT NOT NULL,
    technology TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS job_content (
    job_id TEXT NOT NULL,
    description TEXT NOT NULL,
    id TEXT PRIMARY KEY,
    responsibilities TEXT NOT NULL,
    requirements TEXT NOT NULL,
    about TEXT NOT NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
`)

const insertJob = db.prepare(`
  INSERT OR IGNORE INTO jobs (id, title, company, location, description, modality, level)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const insertTechnology = db.prepare(`
  INSERT OR IGNORE INTO job_technologies (job_id, technology)
  VALUES (?, ?)
`)

const insertContent = db.prepare(`
  INSERT OR IGNORE INTO job_content (job_id, description, id, responsibilities, requirements, about)
  VALUES (?, ?, ?, ?, ?, ?)
`)

const seed = db.transaction(() => {
  jobs.forEach((job) => {
    insertJob.run(
        job.id,
        job.title,
        job.company,
        job.location,
        job.description,
        job.modality,
        job.level
    )

    job.technologies.forEach((technology) => {
      insertTechnology.run(job.id, technology)
    })

    insertContent.run(
      job.id,
      job.content.description,
      crypto.randomUUID(),
      job.content.responsibilities,
      job.content.requirements,
      job.content.about
    )
  })
})

seed()

console.log('Base de datos inicializada')
