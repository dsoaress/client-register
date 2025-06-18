import { type Controller, type HttpServer, httpStatusCode } from 'core'
import type { CreateClientInputDTO } from '../../../app/dtos/create-client-input.dto'
import type { GetAllClientsInputDTO } from '../../../app/dtos/get-all-clients-input.dto'
import type { GetClientByIdInputDTO } from '../../../app/dtos/get-client-by-id-input.dto'
import type { UpdateClientInputDTO } from '../../../app/dtos/update-client-input.dto'
import type { UpdateClientPasswordInputDTO } from '../../../app/dtos/update-client-password-input.dto'
import type { CreateClientUseCase } from '../../../app/use-cases/create-client.use-case'
import type { DeleteClientUseCase } from '../../../app/use-cases/delete-client.use-case'
import type { GetAllClientsUseCase } from '../../../app/use-cases/get-all-clients.use-case'
import type { GetClientByIdUseCase } from '../../../app/use-cases/get-client-by-id.use-case'
import type { UpdateClientUseCase } from '../../../app/use-cases/update-client.use-case'
import type { UpdateClientPasswordUseCase } from '../../../app/use-cases/update-client-password.use-case'

export class ClientController implements Controller {
  private readonly prefix = '/clients'

  constructor(
    private readonly server: HttpServer,
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly getAllClientsUseCase: GetAllClientsUseCase,
    private readonly getClientByIdUseCase: GetClientByIdUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
    private readonly updateClientPasswordUseCase: UpdateClientPasswordUseCase,
    private readonly deleteClientUseCase: DeleteClientUseCase
  ) {}

  initialize(): void {
    this.server.post<{ body: CreateClientInputDTO }>(this.prefix, async (req, res) => {
      const input = req.body
      await this.createClientUseCase.execute(input)
      res.status(httpStatusCode.CREATED)
    })

    this.server.get<{ query: GetAllClientsInputDTO }>(this.prefix, async (req, res) => {
      const input = req.query
      const output = await this.getAllClientsUseCase.execute(input)
      res.status(httpStatusCode.OK).send(output)
    })

    this.server.get<{ params: { id: string }; query: GetClientByIdInputDTO }>(
      `${this.prefix}/:id`,
      async (req, res) => {
        const input = { ...req.query, ...req.params }
        const output = await this.getClientByIdUseCase.execute(input)
        res.status(httpStatusCode.OK).send(output)
      }
    )

    this.server.patch<{ params: { id: string }; body: UpdateClientInputDTO }>(
      `${this.prefix}/:id`,
      async (req, res) => {
        const input = { ...req.body, ...req.params }
        await this.updateClientUseCase.execute(input)
        res.status(httpStatusCode.NO_CONTENT)
      }
    )

    this.server.patch<{ params: { id: string }; body: UpdateClientPasswordInputDTO }>(
      `${this.prefix}/:id/password`,
      async (req, res) => {
        const input = { ...req.body, ...req.params }
        await this.updateClientPasswordUseCase.execute(input)
        res.status(httpStatusCode.NO_CONTENT)
      }
    )

    this.server.delete<{ params: { id: string } }>(`${this.prefix}/:id`, async (req, res) => {
      const input = req.params
      await this.deleteClientUseCase.execute(input)
      res.status(httpStatusCode.NO_CONTENT)
    })
  }
}
