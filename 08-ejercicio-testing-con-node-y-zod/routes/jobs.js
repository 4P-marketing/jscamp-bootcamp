import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'
import { validateJob, validatePartialJob } from '../schemas/jobs.js'

export const jobsRouter = Router()

function validateCreate(req, res, next) {
  const result = validateJob(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: 'Invalid Request',
      details: result.error.issues,
    })
  }

  req.body = result.data
  next()
}

function validatePartialUpdate(req, res, next) {
  const result = validatePartialJob(req.body)

  if (!result.success) {
    return res.status(400).json({
      error: 'Invalid Request',
      details: result.error.issues,
    })
  }

  req.body = result.data
  next()
}

jobsRouter.get('/', JobController.getAll)
jobsRouter.get('/:id', JobController.getId)

jobsRouter.post('/', validateCreate, JobController.create)

jobsRouter.put('/:id', JobController.update)

jobsRouter.patch('/:id', validatePartialUpdate, JobController.partialUpdate)

jobsRouter.delete('/:id', JobController.delete)
