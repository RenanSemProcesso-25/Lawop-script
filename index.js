import './config/env.js'
import './config/database.js'
import { logInfo, logError, logSuccess } from './utils/logs.js'
import updateCCRfields from './operations/updateCCRfields.js'
import updateGroupsColumns from './operations/updateGroupsColumns.js'
import refactorFields from './operations/refactor-fields.js'
import subsidiesRpaSearch from './operations/subsidiesRpaSearch.js'
import updateRpaLogs from './operations/update-rpa-logs.js'
import updateTerms from './operations/update-terms.js'



const operations = [updateCCRfields, updateGroupsColumns, refactorFields, subsidiesRpaSearch, updateRpaLogs, updateTerms]

function ensureEnv() {
  const required = ['DATABASE_MONGO']
  const missing = required.filter((k) => !process.env[k])
  if (missing.length) {
    logError(
      `Variáveis ausentes: ${missing.join(', ')}. Configure-as em .env ou .env.dev.`
    )
    process.exit(1)
  }
}

async function main() {
  ensureEnv()
  logInfo('Inicializando script e conexão com MongoDB...')
  // A conexão é iniciada em config/database.js

  // Parse command line arguments
  const args = process.argv.slice(2)
  const argMap = {}
  args.forEach(arg => {
    const [key, value] = arg.split('=')
    if (key && value !== undefined) {
      argMap[key] = value
    }
  })

  const operationName = argMap.operation
  if (!operationName) {
    logError('Parâmetro "operation" não fornecido. Use: operation=nomeDaOperacao')
    process.exit(1)
  }

  const op = operations.find((o) => o.name === operationName)
  if (!op) {
    logError(`Operação desconhecida: ${operationName}`)
    process.exit(1)
  }

  await op()
}

main()
  .then(() => {
    logSuccess('Script finalizado com sucesso')
    process.exit(0)
  })
  .catch((err) => {
    logError(err)
    process.exit(1)
  })

process.on('SIGINT', () => {
  logInfo('Finalizando processo (SIGINT)...')
  process.exit(0)
})