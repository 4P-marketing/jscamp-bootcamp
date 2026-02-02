import express from 'express'
import { jobsRouter } from './routes/jobs.js'

const PORT = 3000
const app = express()

app.use('/jobs', jobsRouter)

app.listen(PORT, () => {
  console.log(`Servidor levantado en http://localhost:${PORT}`)
})
