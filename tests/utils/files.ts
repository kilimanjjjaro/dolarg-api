import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach } from 'vitest'
import { DB_FILE_NAME } from '../constants/unit'

export function useTempDbFile() {
  const directories: string[] = []

  afterEach(async () => {
    await Promise.all(
      directories.splice(0).map(async (directory) => {
        await rm(directory, { recursive: true, force: true })
      })
    )
  })

  return async (content: string) => {
    const directory = await mkdtemp(join(tmpdir(), 'dolarg-api-'))
    directories.push(directory)

    const file = join(directory, DB_FILE_NAME)
    await writeFile(file, content, 'utf-8')

    return file
  }
}
