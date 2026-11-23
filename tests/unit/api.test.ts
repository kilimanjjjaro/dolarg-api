import { describe, expect, it } from 'vitest'
import app from '../../api/index'
import data from '../../db/exchangeRates.json'
import {
  CROSS_ORIGIN,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_OK
} from '../constants/unit'

describe('GET /', () => {
  it('responds 200 with the exchange rates database as json', async () => {
    const response = await app.request('/')

    expect(response.status).toBe(HTTP_STATUS_OK)
    expect(response.headers.get('content-type')).toMatch(/^application\/json/u)
    expect(await response.json()).toEqual(data)
  })

  it.fails('allows requests from any origin', async () => {
    const response = await app.request('/', {
      headers: { Origin: CROSS_ORIGIN }
    })

    expect(response.headers.get('access-control-allow-origin')).toBe('*')
  })
})

describe('unknown routes', () => {
  it('respond 404', async () => {
    const response = await app.request('/nope')

    expect(response.status).toBe(HTTP_STATUS_NOT_FOUND)
  })
})
