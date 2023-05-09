import scrapeIt from 'scrape-it'
import pc from 'picocolors'
import { type dollarQuotesInterface } from '../interfaces'

export const scraper = async () => {
  const { data } = await scrapeIt<dollarQuotesInterface>('https://www.lanacion.com.ar/dolar-oficial-historico/', {
    dolarOficial: {
      selector: '.dolar-subgroup li:nth-child(1) .currency-data .com-text',
      data: {
        compra: 'strong:nth-of-type(1)',
        venta: 'strong:nth-of-type(2)'
      }
    },
    dolarBlue: {
      selector: '.dolar-subgroup li:nth-child(2) .currency-data .com-text',
      data: {
        compra: 'strong:nth-of-type(1)',
        venta: 'strong:nth-of-type(2)'
      }
    },
    dolarTarjeta: {
      selector: '.dolar-subgroup li:nth-child(3) .currency-data .com-text',
      data: {
        venta: 'strong'
      }
    },
    dolarTurista: {
      selector: '.dolar-subgroup li:nth-child(4) .currency-data .com-text',
      data: {
        venta: 'strong'
      }
    },
    dolarMEP: {
      selector: '.dolar-subgroup li:nth-child(5) .currency-data .com-text',
      data: {
        venta: 'strong'
      }
    },
    dolarCCL: {
      selector: '.dolar-subgroup li:nth-child(6) .currency-data .com-text',
      data: {
        venta: 'strong'
      }
    },
    dolarMayorista: {
      selector: '.dolar-subgroup li:nth-child(7) .currency-data .com-text',
      data: {
        venta: 'strong'
      }
    }
  })

  console.log(data)

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
