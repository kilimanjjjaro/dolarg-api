import dayjs from 'dayjs'
import { DATE_FORMAT, DB_FILE, MS_PER_SECOND } from '../constants'
import { scraper } from '../utils/scraper'
import { logError, logInfo, logSuccess } from '../utils/logger'
import { readDBFile, writeDBFile, updateDollarQuotes } from '../utils/database'

export async function scrapeAndSave(dbFile = DB_FILE) {
  const start = performance.now()

  try {
    logInfo('Scraping started')
    const exchangeRate = await scraper()
    logSuccess('Scraping finished')

    logInfo('Saving to database started')
    const newDollarQuotes = {
      date: dayjs().format(DATE_FORMAT),
      results: exchangeRate
    }

    const currentDollarQuotes = await readDBFile(dbFile)

    const updatedDollarQuotes = updateDollarQuotes({
      newDollarQuotes,
      currentDollarQuotes
    })

    await writeDBFile(updatedDollarQuotes, dbFile)
    logSuccess('Saving to database finished')
  } catch (error) {
    logError(`Scraping failed: ${String(error)}`)
    throw error
  } finally {
    const end = performance.now()
    const time = (end - start) / MS_PER_SECOND

    logInfo(`Scraping took ${time} seconds`)
  }
}
