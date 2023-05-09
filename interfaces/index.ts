export interface dollarQuotesInterface {
  dolarOficial: {
    compra: string
    venta: string
  }
  dolarBlue: {
    compra: string
    venta: string
  }
  dolarTarjeta: {
    venta: string
  }
  dolarTurista: {
    venta: string
  }
  dolarMEP: {
    venta: string
  }
  dolarCCL: {
    venta: string
  }
  dolarMayorista: {
    venta: string
  }
}

export interface newDollarQuotesInterface {
  date: string
  results: dollarQuotesInterface
}

export interface currentDollarQuotesInterface {
  latest: newDollarQuotesInterface
  historical: newDollarQuotesInterface[]
}
