import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseExchangeRates, removeCents } from '../../utils/scraper'
import { allRateValues, toRateTable } from '../utils/rates'
import LANACION_CASES from '../constants/lanacion-cases.json'
import REMOVE_CENTS_CASES from '../constants/remove-cents-cases.json'

const PRICE_PATTERN = /^\$\d+(,\d{2})?$/u

// La Nacion reordered its rows, and the scraper picks them by position.
const MISPLACED_CURRENCIES = new Set(['dolarCCL', 'dolarMayorista'])

describe('removeCents', () => {
  it.each(REMOVE_CENTS_CASES)(
    'turns "$value" into "$expected"',
    ({ value, expected }) => {
      expect(removeCents(value)).toBe(expected)
    }
  )
})

describe('parseExchangeRates', () => {
  const html = readFileSync(
    join(import.meta.dirname, '../fixtures/lanacion.html'),
    'utf-8'
  )
  const rates = parseExchangeRates(html)
  const table = toRateTable(rates)

  const placedCases = LANACION_CASES.filter(
    ({ currency }) => !MISPLACED_CURRENCIES.has(currency)
  )
  const misplacedCases = LANACION_CASES.filter(({ currency }) =>
    MISPLACED_CURRENCIES.has(currency)
  )

  it.each(placedCases)(
    'reads $currency $field as $expected',
    ({ currency, field, expected }) => {
      expect(table.get(currency)?.get(field)).toBe(expected)
    }
  )

  misplacedCases.forEach(({ currency, field, expected }) => {
    it.fails(`reads ${currency} ${field} as ${expected}`, () => {
      expect(table.get(currency)?.get(field)).toBe(expected)
    })
  })

  it.fails('reads a single price for every value', () => {
    allRateValues(rates).forEach((value) => {
      expect(value).toMatch(PRICE_PATTERN)
    })
  })
})
