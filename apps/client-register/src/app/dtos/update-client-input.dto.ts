import type { CreateClientInputDTO } from './create-client-input.dto'

export interface UpdateClientInputDTO extends Partial<Omit<CreateClientInputDTO, 'password'>> {
  id: string
}
