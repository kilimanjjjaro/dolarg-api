import scrapeIt from 'scrape-it'
import {
  EMPTY_CENTS,
  FIRST_INDEX,
  SOURCE_TITLES,
  SOURCE_URL
} from '../constants'
import type { ExchangeRatesInterface } from '../interfaces'

interface CurrencyRow {
  title: string
  labels: string[]
  prices: string[]
}

interface ScrapedPage {
  rows: CurrencyRow[]
}

export const EXCHANGE_RATES_OPTIONS: scrapeIt.ScrapeOptions = {
  rows: {
    listItem: '.dolar-subgroup li',
    data: {
      title: '.dolar-title',
      labels: { listItem: 'p.com-text span' },
      prices: { listItem: 'p.com-text strong' }
    }
  }
}

export const removeCents = (value: string) =>
  value.endsWith(EMPTY_CENTS)
    ? value.slice(FIRST_INDEX, -EMPTY_CENTS.length)
    : value

const normalizeText = (text: string) => text.trim().toLowerCase()

const findPrices = (rows: CurrencyRow[], title: string) => {
  const row = rows.find(
    (row) => normalizeText(row.title) === normalizeText(title)
  )

  if (row === undefined) {
    throw new Error(`La Nacion has no "${title}" row`)
  }

  return new Map(
    row.labels.map((label, index) => [
      normalizeText(label),
      removeCents(row.prices[index] ?? '')
    ])
  )
}

const findPrice = (rows: CurrencyRow[], title: string, field: string) => {
  const price = findPrices(rows, title).get(field)

  if (price === undefined || price === '') {
    throw new Error(`La Nacion has no "${field}" price for "${title}"`)
  }

  return price
}

const toExchangeRates = ({ rows }: ScrapedPage): ExchangeRatesInterface => {
  const purchaseAndSale = (title: string) => ({
    compra: findPrice(rows, title, 'compra'),
    venta: findPrice(rows, title, 'venta')
  })
  const sale = (title: string) => ({ venta: findPrice(rows, title, 'venta') })

  return {
    dolarOficial: purchaseAndSale(SOURCE_TITLES.dolarOficial),
    dolarBlue: purchaseAndSale(SOURCE_TITLES.dolarBlue),
    dolarTarjeta: sale(SOURCE_TITLES.dolarTarjeta),
    dolarMEP: sale(SOURCE_TITLES.dolarMEP),
    dolarCCL: sale(SOURCE_TITLES.dolarCCL),
    dolarMayorista: sale(SOURCE_TITLES.dolarMayorista)
  }
}

export const parseExchangeRates = (html: string) =>
  toExchangeRates(
    scrapeIt.scrapeHTML<ScrapedPage>(html, EXCHANGE_RATES_OPTIONS)
  )

export const scraper = async () => {
  const { data } = await scrapeIt<ScrapedPage>(
    SOURCE_URL,
    EXCHANGE_RATES_OPTIONS
  )

  return toExchangeRates(data)
}
