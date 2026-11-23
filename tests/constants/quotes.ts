import { type ExchangeRatesInterface } from '../../interfaces'

export const SCRAPED_RESULTS: ExchangeRatesInterface = {
  dolarOficial: { compra: '$1548,00', venta: '$1642,00' },
  dolarBlue: { compra: '$1624,75', venta: '$1675,00' },
  dolarTarjeta: { venta: '$2134,60' },
  dolarTurista: { venta: '$1736,94' },
  dolarMEP: { venta: '$1701,05' },
  dolarCCL: { venta: '$1580,00' },
  dolarMayorista: { venta: '' }
}

export const SAVED_RESULTS: ExchangeRatesInterface = {
  dolarOficial: { compra: '$1548', venta: '$1642' },
  dolarBlue: { compra: '$1624,75', venta: '$1675' },
  dolarTarjeta: { venta: '$2134,60' },
  dolarTurista: { venta: '$1736,94' },
  dolarMEP: { venta: '$1701,05' },
  dolarCCL: { venta: '$1580' },
  dolarMayorista: { venta: '' }
}
