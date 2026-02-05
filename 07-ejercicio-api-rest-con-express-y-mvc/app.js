import express from 'express'
import { jobsRouter } from './routes/jobs.js'

const app = express()

app.use(express.json())
app.use('/jobs', jobsRouter)

export default app
