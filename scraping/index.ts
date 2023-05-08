import dayjs from 'dayjs'
import { scraper, logError, logInfo, logSuccess } from '../utils/scraper'
import { readDBFile, writeDBFile, updateExchangeRates } from '../utils/database'

async function scrapeAndSave () {
  const start = performance.now()

  try {
    logInfo('Scraping started')
    const ExchangeRates = await scraper()
    logSuccess('Scraping finished')

    logInfo('Saving to database started')
    const newExchangeRates = {
      date: dayjs().format('DD-MM-YYYY HH:mm:ss'),
      results: ExchangeRates
    }

    const currentExchangeRates = await readDBFile()

    const updatedExchangeRates = updateExchangeRates({ newExchangeRates, currentExchangeRates })

    await writeDBFile(updatedExchangeRates)

    logSuccess('Saving to database finished')
  } catch (error) {
    logError('Scraping failed')
  } finally {
    const end = performance.now()
    const time = (end - start) / 1000

    logInfo(`Scraping took ${time} seconds`)
  }
}

await scrapeAndSave()
