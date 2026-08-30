import type { Request, Response, NextFunction } from 'express'

// ================================
// TIPOS
// ================================

interface CorsOptions {
  allowedOrigins?: string[]
  allowedMethods?: string[]
  allowedHeaders?: string[]
}

type CorsMiddleware = (req: Request, res: Response, next: NextFunction) => void

// ================================
// MIDDLEWARE FACTORY
// ================================

const defaultOptions: CorsOptions = {
  allowedOrigins: ['*'],
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

export function corsMiddleware(options: CorsOptions = {}): CorsMiddleware {
  const config = { ...defaultOptions, ...options }

  return (req, res, next) => {
    const origin = req.headers.origin ?? '*'

    // Verificar si el origen está permitido
    const isAllowed =
      config.allowedOrigins?.includes('*') || config.allowedOrigins?.includes(origin)

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin)
    }

    res.setHeader('Access-Control-Allow-Methods', config.allowedMethods?.join(', ') ?? '')

    res.setHeader('Access-Control-Allow-Headers', config.allowedHeaders?.join(', ') ?? '')

    // Preflight request
    if (req.method === 'OPTIONS') {
      res.status(204).send()
      return
    }

    next()
  }
}
