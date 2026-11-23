import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { FIRST_INDEX, HISTORICAL_LIMIT, JSON_INDENT } from '../../constants'
import {
  readDBFile,
  updateDollarQuotes,
  writeDBFile
} from '../../utils/database'
import {
  LAST_INDEX_OFFSET,
  NEW_QUOTE_HOURS_AGO,
  SINGLE_QUOTE
} from '../constants/unit'
import { useTempDbFile } from '../utils/files'
import { buildDollarQuotes, buildQuote } from '../utils/quotes'

describe('updateDollarQuotes', () => {
  const newDollarQuotes = buildQuote(NEW_QUOTE_HOURS_AGO)

  it('starts the database with the new quote and an empty historical', () => {
    const currentDollarQuotes = null

    expect(
      updateDollarQuotes({ newDollarQuotes, currentDollarQuotes })
    ).toEqual({ latest: newDollarQuotes, historical: [] })
  })

  it('moves the latest quote to the start of the historical', () => {
    const currentDollarQuotes = buildDollarQuotes(
      HISTORICAL_LIMIT - SINGLE_QUOTE
    )
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
    expect(updated.historical).toEqual([
      latest,
      ...historical.slice(FIRST_INDEX, -LAST_INDEX_OFFSET)
    ])
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

  it('fails when the file does not hold the dollar quotes', async () => {
    const file = await createDbFile(JSON.stringify({ latest: null }))

    await expect(readDBFile(file)).rejects.toThrow(file)
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
