import dayjs from 'dayjs'
import { DATE_FORMAT } from '../../constants'
import {
  type currentDollarQuotesInterface,
  type newDollarQuotesInterface
} from '../../interfaces'
import { FIXTURE_RATES } from '../constants/quotes'
import { FIRST_QUOTE_DATE } from '../constants/unit'

export function buildQuote(hoursAgo: number): newDollarQuotesInterface {
  return {
    date: dayjs(FIRST_QUOTE_DATE)
      .subtract(hoursAgo, 'hour')
      .format(DATE_FORMAT),
    results: structuredClone(FIXTURE_RATES)
  }
}

export function buildDollarQuotes(
  historicalLength: number
): currentDollarQuotesInterface {
  return {
    latest: buildQuote(0),
    historical: Array.from({ length: historicalLength }, (_, index) =>
      buildQuote(index + 1)
    )
  }
}
