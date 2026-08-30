/* Aquí irá tu código del primer ejercicio */
import Database from 'better-sqlite3'

const db = new Database('jobs.db')

db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export { db }