import path from 'node:path'

export const DB_PATH = path.join(process.cwd(), './db')
export const DB_FILE = path.join(DB_PATH, 'exchangeRates.json')

export const HISTORICAL_LIMIT = 20

export const SOURCE_URL = 'https://www.lanacion.com.ar/dolar-oficial-historico/'

export const SOURCE_TITLES = {
  dolarOficial: 'Dólar oficial',
  dolarBlue: 'Dólar blue',
  dolarTarjeta: 'Dólar tarjeta',
  dolarMEP: 'Dólar MEP',
  dolarCCL: 'Dólar CCL',
  dolarMayorista: 'Dólar mayorista',
  euro: 'Euro'
} as const

export const DATE_FORMAT = 'DD-MM-YYYY HH:mm:ss'

export const EMPTY_CENTS = ',00'

export const JSON_INDENT = 2

export const FIRST_INDEX = 0

export const MS_PER_SECOND = 1000

export const FAILURE_EXIT_CODE = 1
