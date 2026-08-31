import { Router } from 'express'
import { JobController } from '../controllers/jobs.js'
import { validateJob, validatePartialJob } from '../schemas/jobs.js'

export const jobsRouter = Router()

// Con esto, evitamos tener dos middleware casi iguales y simplificamos el comportamiento de las funciones
const validate = (validateFn) => (req, res, next) => {
  const result = validateFn(req.body)

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

// jobsRouter.post('/', validateCreate, JobController.create)
jobsRouter.post('/', validate(validateJob), JobController.create)

// jobsRouter.put('/:id', validateCreate, JobController.update)
jobsRouter.put('/:id', validate(validateJob), JobController.update)

// jobsRouter.patch('/:id', validatePartialUpdate, JobController.partialUpdate)
jobsRouter.patch('/:id', validate(validatePartialJob), JobController.partialUpdate)

jobsRouter.delete('/:id', JobController.delete)
