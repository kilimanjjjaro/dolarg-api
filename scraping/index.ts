import dayjs from 'dayjs'
import { scraper, logError, logInfo, logSuccess } from '../utils/scraper'
import { readDBFile, writeDBFile, updateDollarQuotes } from '../utils/database'

async function scrapeAndSave() {
  const start = performance.now()

  try {
    logInfo('Scraping started')
    const exchangeRate = await scraper()
    logSuccess('Scraping finished')

    logInfo('Saving to database started')
    const newDollarQuotes = {
      date: dayjs().format('DD-MM-YYYY HH:mm:ss'),
      results: exchangeRate
    }

    const currentDollarQuotes = await readDBFile()

    const updatedDollarQuotes = updateDollarQuotes({
      newDollarQuotes,
      currentDollarQuotes
    })

    await writeDBFile(updatedDollarQuotes)
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
