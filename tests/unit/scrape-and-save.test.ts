import { readFile } from 'node:fs/promises'
import scrapeIt from 'scrape-it'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HISTORICAL_LIMIT, SOURCE_URL } from '../../constants'
import { scrapeAndSave } from '../../scraping/scrapeAndSave'
import { EXCHANGE_RATES_OPTIONS, scraper } from '../../utils/scraper'
import { FIXTURE_RATES } from '../constants/quotes'
import { SCRAPE_DATE, SCRAPE_DATE_TEXT, SINGLE_CALL } from '../constants/unit'
import { readLaNacionPage } from '../utils/fixtures'
import { useTempDbFile } from '../utils/files'
import { buildDollarQuotes } from '../utils/quotes'

vi.mock('scrape-it', async (importOriginal) => {
  const { default: actual } = await importOriginal<{
    default: typeof scrapeIt
  }>()

  return {
    default: Object.assign(vi.fn(), { scrapeHTML: actual.scrapeHTML })
  }
})

const scrapeItMock = vi.mocked(scrapeIt)

function resolveScrape() {
  scrapeItMock.mockResolvedValue({
    data: scrapeIt.scrapeHTML(readLaNacionPage(), EXCHANGE_RATES_OPTIONS)
  } as unknown as Awaited<ReturnType<typeof scrapeIt>>)
}

describe('scraper', () => {
  beforeEach(() => {
    scrapeItMock.mockReset()
  })

  it('scrapes the exchange rates from the La Nacion page', async () => {
    resolveScrape()

    expect(await scraper()).toEqual(FIXTURE_RATES)
    expect(scrapeItMock).toHaveBeenCalledTimes(SINGLE_CALL)
    expect(scrapeItMock).toHaveBeenCalledWith(
      SOURCE_URL,
      EXCHANGE_RATES_OPTIONS
    )
  })
})

describe('scrapeAndSave', () => {
  const createDbFile = useTempDbFile()

  beforeEach(() => {
    scrapeItMock.mockReset()
    vi.spyOn(console, 'log').mockImplementation(() => undefined)
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(SCRAPE_DATE)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('saves the scraped rates as the latest quote and moves the previous one to the historical', async () => {
    resolveScrape()
    const current = buildDollarQuotes(HISTORICAL_LIMIT - 1)
    const file = await createDbFile(JSON.stringify(current))

    await scrapeAndSave(file)

    expect(JSON.parse(await readFile(file, 'utf-8'))).toEqual({
      latest: { date: SCRAPE_DATE_TEXT, results: FIXTURE_RATES },
      historical: [current.latest, ...current.historical]
    })
  })

  it('starts an empty database with the scraped rates', async () => {
    resolveScrape()
    const file = await createDbFile('')

    await scrapeAndSave(file)

    expect(JSON.parse(await readFile(file, 'utf-8'))).toEqual({
      latest: { date: SCRAPE_DATE_TEXT, results: FIXTURE_RATES },
      historical: []
    })
  })

  it('leaves the database untouched when scraping fails', async () => {
    scrapeItMock.mockRejectedValue(new Error('network down'))
    const content = JSON.stringify(buildDollarQuotes(HISTORICAL_LIMIT))
    const file = await createDbFile(content)

    await scrapeAndSave(file).catch(() => undefined)

    expect(await readFile(file, 'utf-8')).toBe(content)
  })

  it('rejects when scraping fails, so the workflow stops', async () => {
    scrapeItMock.mockRejectedValue(new Error('network down'))
    const file = await createDbFile('')

    await expect(scrapeAndSave(file)).rejects.toThrow()
  })
})
