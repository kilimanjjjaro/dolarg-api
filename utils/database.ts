import { readFile, writeFile } from 'node:fs/promises'
import { DB_PATH } from '../constants'
import { type currentDollarQuotesInterface, type newDollarQuotesInterface } from '../interfaces'

interface Props {
  newDollarQuotes: newDollarQuotesInterface
  currentDollarQuotes: currentDollarQuotesInterface
}

export async function readDBFile () {
  const data = await readFile(`${DB_PATH}/dollarQuotes.json`, 'utf-8')

  return data !== '' ? JSON.parse(data) : null
}

export async function writeDBFile (data: any) {
  await writeFile(
    `${DB_PATH}/dollarQuotes.json`,
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}

export const updateDollarQuotes = ({ newDollarQuotes, currentDollarQuotes }: Props) => {
  if (currentDollarQuotes === null && newDollarQuotes !== null) return { latest: newDollarQuotes, historical: [] }

  const latest = { ...currentDollarQuotes.latest }
  currentDollarQuotes.historical.unshift({ ...latest })
  currentDollarQuotes.latest = newDollarQuotes

  return currentDollarQuotes
}
