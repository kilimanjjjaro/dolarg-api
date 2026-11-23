import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { DATE_FORMAT } from '../../constants'
import type { ExchangeRatesInterface } from '../../interfaces'
import { RATE_TABLE_SCHEMA } from '../constants/schemas'

dayjs.extend(customParseFormat)

export function allRateValues(rates: ExchangeRatesInterface) {
  return Object.values(RATE_TABLE_SCHEMA.parse(rates)).flatMap((values) =>
    Object.values(values)
  )
}

export function parseQuoteDate(date: string) {
  return dayjs(date, DATE_FORMAT, true)
}
