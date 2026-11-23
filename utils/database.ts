import { readFile, writeFile } from 'node:fs/promises'
import { DB_FILE, HISTORICAL_LIMIT } from '../constants'
import {
  type currentDollarQuotesInterface,
  type newDollarQuotesInterface
} from '../interfaces'

export async function readDBFile(file = DB_FILE) {
  const data = await readFile(file, 'utf-8')

  return data !== '' ? JSON.parse(data) : null
}

export async function writeDBFile(data: any, file = DB_FILE) {
  await writeFile(file, JSON.stringify(data, null, 2), 'utf-8')
}

export const updateDollarQuotes = ({
  newDollarQuotes,
  currentDollarQuotes
}: {
  newDollarQuotes: newDollarQuotesInterface
  currentDollarQuotes: currentDollarQuotesInterface | null
}): currentDollarQuotesInterface => {
  if (currentDollarQuotes === null) {
    return { latest: newDollarQuotes, historical: [] }
  }

  return {
    latest: newDollarQuotes,
    historical: [
      currentDollarQuotes.latest,
      ...currentDollarQuotes.historical
    ].slice(0, HISTORICAL_LIMIT)
  }
}
