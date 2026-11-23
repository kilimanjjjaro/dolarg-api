import { FAILURE_EXIT_CODE } from '../constants'
import { scrapeAndSave } from './scrapeAndSave'

await scrapeAndSave().catch(() => {
  process.exitCode = FAILURE_EXIT_CODE
})
