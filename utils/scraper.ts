import scrapeIt from 'scrape-it'
import pc from 'picocolors'
import { type ExchangeRatesInterface } from '../interfaces'

export const scraper = async () => {
  const { data } = await scrapeIt<ExchangeRatesInterface>('https://dolarhoy.com', {
    dolarBlue: {
      listItem: '.is-7 .tile.is-child:nth-child(1) .values',
      data: {
        compra: '.compra .val',
        venta: '.venta .val'
      }
    },
    dolarOficial: {
      listItem: '.is-7 .tile.is-child:nth-child(2) .values',
      data: {
        compra: '.compra .val',
        venta: '.venta .val'
      }
    },
    contadoConLiqui: {
      listItem: '.is-7 .tile.is-child:nth-child(4) .values',
      data: {
        compra: '.compra .val',
        venta: '.venta .val'
      }
    },
    dolarSolidario: {
      listItem: '.is-7 .tile.is-child:nth-child(6) .values',
      data: {
        venta: '.venta .val'
      }
    }
  })

  return data
}

const symbol = {
  info: pc.blue('ℹ'),
  success: pc.green('✔'),
  error: pc.red('✖')
}

export const logInfo = (args: string) => { console.log(`${symbol.info} ${pc.blue(args)}`) }
export const logError = (args: string) => { console.log(`${symbol.error} ${pc.red(args)}`) }
export const logSuccess = (args: string) => { console.log(`${symbol.success} ${pc.green(args)}`) }
