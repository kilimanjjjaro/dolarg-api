import { z } from 'zod'
import { HISTORICAL_LIMIT } from '../../constants'

const DATE_PATTERN = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/v

export const PRICE_PATTERN = /^\$\d+(?:,\d{1,2})?$/v

const PRICE = z.string().regex(PRICE_PATTERN)

export const RATE_TABLE_SCHEMA = z.record(
  z.string(),
  z.record(z.string(), z.string())
)

const SALE = z.strictObject({ venta: PRICE })

const PURCHASE_AND_SALE = z.strictObject({
  compra: PRICE,
  venta: PRICE
})

export const EXCHANGE_RATES_SCHEMA = z.strictObject({
  dolarOficial: PURCHASE_AND_SALE,
  dolarBlue: PURCHASE_AND_SALE,
  dolarTarjeta: SALE,
  dolarMEP: SALE,
  dolarCCL: SALE,
  dolarMayorista: SALE,
  euro: PURCHASE_AND_SALE
})

export const DOLLAR_QUOTES_SCHEMA = z.strictObject({
  date: z.string().regex(DATE_PATTERN),
  results: EXCHANGE_RATES_SCHEMA
})

export const DB_SCHEMA = z.strictObject({
  latest: DOLLAR_QUOTES_SCHEMA,
  historical: z.array(DOLLAR_QUOTES_SCHEMA).max(HISTORICAL_LIMIT)
})
