export interface dollarQuotesInterface {
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

export interface newDollarQuotesInterface {
  date: string
  results: dollarQuotesInterface
}

export interface currentDollarQuotesInterface {
  latest: newDollarQuotesInterface
  history: newDollarQuotesInterface[]
}
