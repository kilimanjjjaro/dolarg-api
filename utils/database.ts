import { readFile, writeFile } from 'node:fs/promises'
import { DB_PATH } from '../constants'
import { type CurrentExchangeRatesInterface, type NewExchangeRatesInterface } from '../interfaces'

interface Props {
  newExchangeRates: NewExchangeRatesInterface
  currentExchangeRates: CurrentExchangeRatesInterface
}

export async function readDBFile () {
  const data = await readFile(`${DB_PATH}/exchangeRates.json`, 'utf-8')

  return data !== '' ? JSON.parse(data) : null
}

export async function writeDBFile (data: any) {
  await writeFile(
    `${DB_PATH}/exchangeRates.json`,
    JSON.stringify(data, null, 2),
    'utf-8'
  )
}

export const updateExchangeRates = ({ newExchangeRates, currentExchangeRates }: Props) => {
  if (currentExchangeRates === null && newExchangeRates !== null) return { latest: newExchangeRates, history: [] }

  const latest = { ...currentExchangeRates.latest }
  currentExchangeRates.history.unshift({ ...latest })
  currentExchangeRates.latest = newExchangeRates

  return currentExchangeRates
}
