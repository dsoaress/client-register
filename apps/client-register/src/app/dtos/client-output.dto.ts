import type { ClientEntity } from '../../domain/entities/client.entity'

export interface ClientOutputDTO extends ReturnType<ClientEntity['toJSON']> {}
