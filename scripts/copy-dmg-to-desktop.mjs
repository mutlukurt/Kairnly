import fs from 'fs'
import os from 'os'
import path from 'path'

const projectRoot = process.cwd()
const dmgDir = path.join(projectRoot, 'src-tauri', 'target', 'release', 'bundle', 'dmg')
const desktopDir = path.join(os.homedir(), 'Desktop')

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = units.shift()
  while (value >= 1024 && units.length > 0) {
    value /= 1024
    unit = units.shift()
  }
  return `${value.toFixed(2)} ${unit}`
}

function fail(message) {
  console.error(`DMG copy failed: ${message}`)
  process.exit(1)
}

if (!fs.existsSync(dmgDir)) {
  fail(`DMG output directory does not exist: ${dmgDir}`)
}

if (!fs.existsSync(desktopDir)) {
  fail(`Desktop directory could not be resolved: ${desktopDir}`)
}

const dmgs = fs
  .readdirSync(dmgDir)
  .filter((file) => file.toLowerCase().endsWith('.dmg'))
  .map((file) => {
    const fullPath = path.join(dmgDir, file)
    const stat = fs.statSync(fullPath)
    return { file, fullPath, mtimeMs: stat.mtimeMs, size: stat.size }
  })
  .sort((a, b) => b.mtimeMs - a.mtimeMs)

if (dmgs.length === 0) {
  fail(`No .dmg file found in: ${dmgDir}`)
}

const newest = dmgs[0]
const destination = path.join(desktopDir, newest.file)

try {
  fs.copyFileSync(newest.fullPath, destination)
} catch (error) {
  fail(`Could not copy "${newest.fullPath}" to "${destination}": ${error.message}`)
}

console.log(`Found DMG: ${newest.fullPath}`)
console.log(`Copied to Desktop: ${destination}`)
console.log(`File size: ${formatBytes(newest.size)}`)
console.log('Success: Kairnly macOS DMG is ready on your Desktop.')
