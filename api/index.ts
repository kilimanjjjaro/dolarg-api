import { Hono } from 'hono'
import { cors } from 'hono/cors'
import data from '../db/exchangeRates.json'

const app = new Hono()

app.use(
  '/api',
  cors({
    origin: '*',
    allowMethods: ['GET']
  })
)

app.get('/api', (ctx) => {
  return ctx.json(data)
})

export default app
