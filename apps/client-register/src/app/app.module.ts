import type { ClientRepository } from './repositories/client.repository'
import { CreateClientUseCase } from './use-cases/create-client.use-case'
import { DeleteClientUseCase } from './use-cases/delete-client.use-case'
import { GetAllClientsUseCase } from './use-cases/get-all-clients.use-case'
import { GetClientByIdUseCase } from './use-cases/get-client-by-id.use-case'
import { UpdateClientUseCase } from './use-cases/update-client.use-case'
import { UpdateClientPasswordUseCase } from './use-cases/update-client-password.use-case'

interface Input {
  clientRepository: ClientRepository
}

interface Output {
  createClientUseCase: CreateClientUseCase
  getAllClientsUseCase: GetAllClientsUseCase
  getClientByIdUseCase: GetClientByIdUseCase
  updateClientUseCase: UpdateClientUseCase
  updateClientPasswordUseCase: UpdateClientPasswordUseCase
  deleteClientUseCase: DeleteClientUseCase
}

export function appModule({ clientRepository }: Input): Output {
  const createClientUseCase = new CreateClientUseCase(clientRepository)
  const getAllClientsUseCase = new GetAllClientsUseCase(clientRepository)
  const getClientByIdUseCase = new GetClientByIdUseCase(clientRepository)
  const updateClientUseCase = new UpdateClientUseCase(clientRepository)
  const updateClientPasswordUseCase = new UpdateClientPasswordUseCase(clientRepository)
  const deleteClientUseCase = new DeleteClientUseCase(clientRepository)

  return {
    createClientUseCase,
    getAllClientsUseCase,
    getClientByIdUseCase,
    updateClientUseCase,
    updateClientPasswordUseCase,
    deleteClientUseCase
  }
}
