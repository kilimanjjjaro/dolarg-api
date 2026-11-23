import { scrapeAndSave } from './scrapeAndSave'

await scrapeAndSave().catch(() => {
  process.exitCode = 1
})
