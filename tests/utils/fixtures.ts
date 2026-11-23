import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { FIRST_INDEX } from '../../constants'

const ROW_START = '<li>'
const ROW_END = '</li>'

export function readLaNacionPage() {
  return readFileSync(
    join(import.meta.dirname, '../fixtures/lanacion.html'),
    'utf-8'
  )
}

export function reverseRows(html: string) {
  const start = html.indexOf(ROW_START)
  const end = html.lastIndexOf(ROW_END) + ROW_END.length
  const rows = html
    .slice(start, end)
    .split(ROW_END)
    .filter((row) => row.trim() !== '')
    .map((row) => `${row.trim()}${ROW_END}`)
    .reverse()
    .join('\n')

  return `${html.slice(FIRST_INDEX, start)}${rows}${html.slice(end)}`
}
