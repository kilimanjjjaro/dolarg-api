import { z } from 'zod'
import { HISTORICAL_LIMIT } from '../../constants'

const DATE_PATTERN = /^\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}$/u

const SALE = z.strictObject({ venta: z.string() })

const PURCHASE_AND_SALE = z.strictObject({
  compra: z.string(),
  venta: z.string()
})

export const EXCHANGE_RATES_SCHEMA = z.strictObject({
  dolarOficial: PURCHASE_AND_SALE,
  dolarBlue: PURCHASE_AND_SALE,
  dolarTarjeta: SALE,
  dolarTurista: SALE,
  dolarMEP: SALE,
  dolarCCL: SALE,
  dolarMayorista: SALE
})

export const DOLLAR_QUOTES_SCHEMA = z.strictObject({
  date: z.string().regex(DATE_PATTERN),
  results: EXCHANGE_RATES_SCHEMA
})

export const DB_SCHEMA = z.strictObject({
  latest: DOLLAR_QUOTES_SCHEMA,
  historical: z.array(DOLLAR_QUOTES_SCHEMA).max(HISTORICAL_LIMIT)
})
