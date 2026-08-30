import { Router } from 'express'
import { JobController } from '../controllers/jobs'
import { validateCreateJob, validateUpdateJob } from '../middlewares/validation'

// ================================
// CREAR ROUTER TIPADO
// ================================

export const jobsRouter = Router()

// ================================
// DEFINIR RUTAS
// ================================

// GET /jobs - Listar todos los jobs
jobsRouter.get('/', JobController.getAll)

// GET /jobs/:id - Obtener un job por ID
jobsRouter.get('/:id', JobController.getById)

// POST /jobs - Crear un job (con validación)
jobsRouter.post('/', validateCreateJob, JobController.create)

// PATCH /jobs/:id - Actualizar parcialmente un job
jobsRouter.patch('/:id', validateUpdateJob, JobController.update)

// DELETE /jobs/:id - Eliminar un job
jobsRouter.delete('/:id', JobController.delete)
