import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { HISTORICAL_LIMIT } from '../../constants'
import {
  readDBFile,
  updateDollarQuotes,
  writeDBFile
} from '../../utils/database'
import { JSON_INDENT } from '../constants/unit'
import { useTempDbFile } from '../utils/files'
import { buildDollarQuotes, buildQuote } from '../utils/quotes'

const NEW_QUOTE_HOURS = -1

describe('updateDollarQuotes', () => {
  const newDollarQuotes = buildQuote(NEW_QUOTE_HOURS)

  it('starts the database with the new quote and an empty historical', () => {
    const currentDollarQuotes = null

    expect(
      updateDollarQuotes({ newDollarQuotes, currentDollarQuotes })
    ).toEqual({ latest: newDollarQuotes, historical: [] })
  })

  it('moves the latest quote to the start of the historical', () => {
    const currentDollarQuotes = buildDollarQuotes(HISTORICAL_LIMIT - 1)
    const { latest, historical } = structuredClone(currentDollarQuotes)

    expect(
      updateDollarQuotes({ newDollarQuotes, currentDollarQuotes })
    ).toEqual({ latest: newDollarQuotes, historical: [latest, ...historical] })
  })

  it(`keeps at most ${HISTORICAL_LIMIT} historical quotes, dropping the oldest`, () => {
    const currentDollarQuotes = buildDollarQuotes(HISTORICAL_LIMIT)
    const { latest, historical } = structuredClone(currentDollarQuotes)

    const updated = updateDollarQuotes({ newDollarQuotes, currentDollarQuotes })

    expect(updated.historical).toHaveLength(HISTORICAL_LIMIT)
    expect(updated.historical).toEqual([latest, ...historical.slice(0, -1)])
  })

  it('does not modify the current quotes', () => {
    const currentDollarQuotes = buildDollarQuotes(HISTORICAL_LIMIT)
    const snapshot = structuredClone(currentDollarQuotes)

    updateDollarQuotes({ newDollarQuotes, currentDollarQuotes })

    expect(currentDollarQuotes).toEqual(snapshot)
  })
})

describe('database file', () => {
  const createDbFile = useTempDbFile()

  it('reads null from an empty file', async () => {
    const file = await createDbFile('')

    expect(await readDBFile(file)).toBeNull()
  })

  it('writes indented json that reads back the same', async () => {
    const file = await createDbFile('')
    const dollarQuotes = buildDollarQuotes(HISTORICAL_LIMIT)

    await writeDBFile(dollarQuotes, file)

    expect(await readFile(file, 'utf-8')).toBe(
      JSON.stringify(dollarQuotes, null, JSON_INDENT)
    )
    expect(await readDBFile(file)).toEqual(dollarQuotes)
  })
})
