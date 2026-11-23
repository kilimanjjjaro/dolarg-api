import pc from 'picocolors'

const symbol = {
  info: pc.blue('ℹ'),
  success: pc.green('✔'),
  error: pc.red('✖')
}

export const logInfo = (args: string) => {
  console.log(`${symbol.info} ${pc.blue(args)}`)
}
export const logError = (args: string) => {
  console.log(`${symbol.error} ${pc.red(args)}`)
}
export const logSuccess = (args: string) => {
  console.log(`${symbol.success} ${pc.green(args)}`)
}
