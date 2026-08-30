import type { Request, Response, NextFunction } from 'express'
import { validateJob, validatePartialJob } from '../schemas/job'

// ================================
// TIPOS PARA MIDDLEWARES
// ================================

// Un middleware en Express tiene esta firma:
// (req: Request, res: Response, next: NextFunction) => void

// Para async middlewares, el retorno puede ser Promise<void>
type AsyncMiddleware = (req: Request, res: Response, next: NextFunction) => Promise<void> | void

// ================================
// MIDDLEWARE DE VALIDACIÓN PARA CREAR
// ================================

export const validateCreateJob: AsyncMiddleware = (req, res, next) => {
  const result = validateJob(req.body)

  if (!result.success) {
    // Zod proporciona errores detallados
    res.status(400).json({
      message: 'Validation error',
      errors: result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    })
    return
  }

  // Sobrescribimos el body con los datos validados y tipados
  req.body = result.data
  next()
}

// ================================
// MIDDLEWARE DE VALIDACIÓN PARA ACTUALIZAR
// ================================

export const validateUpdateJob: AsyncMiddleware = (req, res, next) => {
  const result = validatePartialJob(req.body)

  if (!result.success) {
    res.status(400).json({
      message: 'Validation error',
      errors: result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    })
    return
  }

  req.body = result.data
  next()
}

// ================================
// MIDDLEWARE GENÉRICO DE VALIDACIÓN
// ================================

import type { ZodSchema } from 'zod'

// Factory function que crea un middleware de validación para cualquier schema
export function createValidationMiddleware<T>(schema: ZodSchema<T>): AsyncMiddleware {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      res.status(400).json({
        message: 'Validation error',
        errors: result.error.errors,
      })
      return
    }

    req.body = result.data
    next()
  }
}
