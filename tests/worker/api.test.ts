import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createTestHarness } from 'wrangler'
import data from '../../db/exchangeRates.json'
import {
  CROSS_ORIGIN,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK
} from '../constants/unit'

const server = createTestHarness({
  workers: [{ configPath: './wrangler.toml' }]
})

beforeAll(async () => {
  await server.listen()
})

afterAll(async () => {
  await server.close()
})

describe('worker on workerd', () => {
  it('serves the exchange rates database as json', async () => {
    const response = await server.fetch('/')

    expect(response.status).toBe(HTTP_STATUS_OK)
    expect(response.headers.get('content-type')).toMatch(/^application\/json/v)
    expect(await response.json()).toEqual(data)
  })

  it('allows requests from any origin', async () => {
    const response = await server.fetch('/', {
      headers: { Origin: CROSS_ORIGIN }
    })

    expect(response.headers.get('access-control-allow-origin')).toBe('*')
  })

  it('responds 404 for unknown routes', async () => {
    const response = await server.fetch('/nope')

    expect(response.status).toBe(HTTP_STATUS_NOT_FOUND)
  })
})
