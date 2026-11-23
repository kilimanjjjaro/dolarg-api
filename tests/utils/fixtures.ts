import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export function readLaNacionPage() {
  return readFileSync(
    join(import.meta.dirname, '../fixtures/lanacion.html'),
    'utf-8'
  )
}
