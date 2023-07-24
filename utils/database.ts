import { readFile, writeFile } from 'node:fs/promises'
import { DB_PATH } from '../constants'
import {
  type currentDollarQuotesInterface,
  type newDollarQuotesInterface
} from '../interfaces'

export async function readDBFile() {
  const data = await readFile(`${DB_PATH}/exchangeRates.json`, 'utf-8')

  return data !== '' ? JSON.parse(data) : null
}

export async function writeDBFile(data: any) {
  await writeFile(
    `${DB_PATH}/exchangeRates.json`,
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}

export const updateDollarQuotes = ({
  newDollarQuotes,
  currentDollarQuotes
}: {
  newDollarQuotes: newDollarQuotesInterface
  currentDollarQuotes: currentDollarQuotesInterface
}) => {
  if (currentDollarQuotes === null && newDollarQuotes !== null) {
    return { latest: newDollarQuotes, historical: [] }
  }

  const latest = { ...currentDollarQuotes.latest }
  const historical = [...currentDollarQuotes.historical]

  if (historical.length >= 20) historical.pop()

  historical.unshift({ ...latest })
  currentDollarQuotes.historical = historical
  currentDollarQuotes.latest = newDollarQuotes

  console.log(currentDollarQuotes.historical.length)

  return currentDollarQuotes
}
