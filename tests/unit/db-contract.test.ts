import { describe, expect, it } from 'vitest'
import data from '../../db/exchangeRates.json'
import { DB_SCHEMA } from '../constants/schemas'
import { parseQuoteDate } from '../utils/rates'

describe('db/exchangeRates.json', () => {
  it('has the shape the api serves', () => {
    const { error } = DB_SCHEMA.safeParse(data)

    expect(error).toBeUndefined()
  })

  it('has valid dates, from the latest back to the oldest historical quote', () => {
    const dates = [data.latest, ...data.historical].map(({ date }) =>
      parseQuoteDate(date)
    )

    dates.forEach((date) => {
      expect(date.isValid()).toBe(true)
    })
    dates.slice(1).forEach((date, index) => {
      expect(date.isAfter(dates[index])).toBe(false)
    })
  })
})
