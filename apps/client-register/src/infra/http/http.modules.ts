import type { HttpServer } from 'core'

import { appModule } from '../../app/app.module'
import type { ClientRepository } from '../../app/repositories/client.repository'
import { ClientController } from './controllers/client.controller'

interface Input {
  server: HttpServer
  clientRepository: ClientRepository
}

export function httpModule({ server, clientRepository }: Input): void {
  const {
    createClientUseCase,
    deleteClientUseCase,
    getAllClientsUseCase,
    getClientByIdUseCase,
    updateClientPasswordUseCase,
    updateClientUseCase
  } = appModule({ clientRepository })

  const clientController = new ClientController(
    server,
    createClientUseCase,
    getAllClientsUseCase,
    getClientByIdUseCase,
    updateClientUseCase,
    updateClientPasswordUseCase,
    deleteClientUseCase
  )

  clientController.initialize()
}
