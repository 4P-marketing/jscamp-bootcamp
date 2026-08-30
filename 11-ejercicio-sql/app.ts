// ================================
// APLICACIÓN EXPRESS CON TYPESCRIPT
// ================================

import express, { type Express, type Request, type Response } from 'express'
import { jobsRouter } from './routes/jobs'
import { corsMiddleware } from './middlewares/cors'

// ================================
// CREAR APP
// ================================

const app: Express = express()

// ================================
// MIDDLEWARES GLOBALES
// ================================

// Parsear JSON en el body
app.use(express.json())

// CORS
app.use(corsMiddleware())

// Desactivar header X-Powered-By
app.disable('x-powered-by')

// ================================
// RUTAS
// ================================

// Health check
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'SQL Express API',
    timestamp: new Date().toISOString(),
  })
})

// API de jobs
app.use('/jobs', jobsRouter)

// 404 para rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.path}`,
  })
})

// ================================
// INICIAR SERVIDOR
// ================================

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║   🚀 Express + SQL Server                  ║
║                                            ║
║   URL: http://localhost:${PORT}               ║
║                                            ║
║   Endpoints:                               ║
║   GET    /jobs                             ║
║   GET    /jobs/:id                         ║
║   POST   /jobs                             ║
║   PATCH  /jobs/:id                         ║
║   DELETE /jobs/:id                         ║
║                                            ║
║   Query params:                            ║
║   ?tech=React                              ║
║   ?modality=remote                         ║
║   ?level=senior                            ║
║                                            ║
╚════════════════════════════════════════════╝
  `)
})

export default app
