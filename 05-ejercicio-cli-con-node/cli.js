import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

const args = process.argv.slice(2)
const dir = args[0] && !args[0].startsWith('--') ? args[0] : '.'

if (!process.permission.has('fs.read', dir)) {
    console.log('No tienes permiso para leer el directorio especificado.')
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
