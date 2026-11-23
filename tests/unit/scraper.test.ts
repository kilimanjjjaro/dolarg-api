import { describe, expect, it } from 'vitest'
import { SOURCE_TITLES } from '../../constants'
import { parseExchangeRates, removeCents } from '../../utils/scraper'
import { FIXTURE_RATES } from '../constants/quotes'
import { PRICE_PATTERN } from '../constants/schemas'
import { readLaNacionPage, reverseRows } from '../utils/fixtures'
import { allRateValues } from '../utils/rates'
import REMOVE_CENTS_CASES from '../constants/remove-cents-cases.json'

const MISSING_TITLE = 'Dólar cripto'

describe('removeCents', () => {
  it.each(REMOVE_CENTS_CASES)(
    'turns "$value" into "$expected"',
    ({ value, expected }) => {
      expect(removeCents(value)).toBe(expected)
    }
  )
})

describe('parseExchangeRates', () => {
  const html = readLaNacionPage()

  it('reads every currency from the row with its title', () => {
    expect(parseExchangeRates(html)).toEqual(FIXTURE_RATES)
  })

  it('reads a single price for every value', () => {
    allRateValues(parseExchangeRates(html)).forEach((value) => {
      expect(value).toMatch(PRICE_PATTERN)
    })
  })

  it('reads the same rates when La Nacion reorders its rows', () => {
    const reversed = reverseRows(html)

    expect(reversed).not.toBe(html)
    expect(parseExchangeRates(reversed)).toEqual(FIXTURE_RATES)
  })

  it.each(Object.values(SOURCE_TITLES))(
    'fails when the page has no "%s" row',
    (title) => {
      const withoutRow = html.replaceAll(`>${title}<`, `>${MISSING_TITLE}<`)

      expect(() => parseExchangeRates(withoutRow)).toThrow(title)
    }
  )
})
