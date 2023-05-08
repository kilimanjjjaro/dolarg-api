export interface ExchangeRatesInterface {
  dolarBlue: {
    compra: string
    venta: string
  }
  dolarOficial: {
    compra: string
    venta: string
  }
  contadoConLiqui: {
    compra: string
    venta: string
  }
  dolarSolidario: {
    venta: string
  }
}

export interface NewExchangeRatesInterface {
  date: string
  results: ExchangeRatesInterface
}

export interface CurrentExchangeRatesInterface {
  latest: NewExchangeRatesInterface
  history: NewExchangeRatesInterface[]
}
