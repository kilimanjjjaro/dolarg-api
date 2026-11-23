import dayjs from 'dayjs'
import { DATE_FORMAT } from '../../constants'
import type {
  currentDollarQuotesInterface,
  newDollarQuotesInterface
} from '../../interfaces'
import { FIXTURE_RATES } from '../constants/quotes'
import {
  FIRST_QUOTE_DATE,
  LATEST_QUOTE_HOURS_AGO,
  NEXT_INDEX_OFFSET
} from '../constants/unit'

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
    latest: buildQuote(LATEST_QUOTE_HOURS_AGO),
    historical: Array.from({ length: historicalLength }, (_, index) =>
      buildQuote(index + NEXT_INDEX_OFFSET)
    )
  }
}
