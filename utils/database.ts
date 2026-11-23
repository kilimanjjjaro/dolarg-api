import { readFile, writeFile } from 'node:fs/promises'
import {
  DB_FILE,
  FIRST_INDEX,
  HISTORICAL_LIMIT,
  JSON_INDENT
} from '../constants'
import type {
  currentDollarQuotesInterface,
  newDollarQuotesInterface
} from '../interfaces'

const isDollarQuotes = (
  value: unknown
): value is currentDollarQuotesInterface =>
  typeof value === 'object' &&
  value !== null &&
  'latest' in value &&
  'historical' in value &&
  Array.isArray(value.historical)

export async function readDBFile(
  file = DB_FILE
): Promise<currentDollarQuotesInterface | null> {
  const data = await readFile(file, 'utf-8')

  if (data === '') return null

  const parsed: unknown = JSON.parse(data)

  if (!isDollarQuotes(parsed)) {
    throw new Error(`${file} does not hold the dollar quotes`)
  }

  return parsed
}

export async function writeDBFile(
  data: currentDollarQuotesInterface,
  file = DB_FILE
) {
  await writeFile(file, JSON.stringify(data, null, JSON_INDENT), 'utf-8')
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
    ].slice(FIRST_INDEX, HISTORICAL_LIMIT)
  }
}
