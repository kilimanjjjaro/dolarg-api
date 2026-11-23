import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { DATE_FORMAT } from '../../constants'
import { type ExchangeRatesInterface } from '../../interfaces'

dayjs.extend(customParseFormat)

export function toRateTable(rates: ExchangeRatesInterface) {
  return new Map(
    Object.entries(rates).map(([currency, values]) => [
      currency,
      new Map(Object.entries(values))
    ])
  )
}

export function allRateValues(rates: ExchangeRatesInterface) {
  return Object.values(rates).flatMap((values) => Object.values(values))
}

export function parseQuoteDate(date: string) {
  return dayjs(date, DATE_FORMAT, true)
}
