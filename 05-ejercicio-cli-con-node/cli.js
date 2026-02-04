import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const args = process.argv.slice(2)
const dir = args[0] && !args[0].startsWith('--') ? args[0] : '.'

// Genial! Me gusta como lo implementaste pidiendo permiso exclusivamente al recurso que se quiere leer.
// Una consideración:
// process.permission solo existe si se ejecuta con el flag --permission, por lo que si no ponemos nada, nos saldrá un error de que `has` no existe. Así que una solución es acceder a `has` con el operador `?.` para que si no existe, no lance error.
if (!process.permission?.has('fs.read', dir)) {
    console.log('No tienes permiso para leer el directorio especificado.')
    /* Con esto damos un poco más de contexto al usuario */
    console.log('Para acceder a ese recurso, ejecuta el script con el flag --permission --allow-fs-read=[directorio_a_leer]')
    
    process.exit(1)
}

const formatBytes = (size) => {
    if (size < 1024) return `${size} B`
    return `${(size / 1024).toFixed(2)} KB`
}

const files = await readdir(dir)

const entries = await Promise.all(
    files.map(async (name) => {
        const info = await stat(join(dir, name))
        return { 
            name, 
            isDir: info.isDirectory(), 
            size: formatBytes(info.size) 
        }
    })
)

const hasArgs = (arg) => args.includes(arg)

const finalEntries = entries
  .filter(e => hasArgs('--files') ? !e.isDir : hasArgs('--folders') ? e.isDir : true)
  .sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1
    if (hasArgs('--asc')) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    }
    if (hasArgs('--desc')) {
      return b.name.toLowerCase().localeCompare(a.name.toLowerCase())
    }
    return 0
  })

for (const entry of finalEntries) {
    const icon = entry.isDir ? '📁' : '📄'
    const size = entry.isDir ? '-' : entry.size
    console.log(`${icon} ${entry.name.padEnd(25)} ${size}`)
}
