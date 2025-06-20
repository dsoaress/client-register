import type { UseCase } from 'core'

import type { ProcessClientDataInputDTO } from '../dtos/process-client-data-input.dto'

export class ProcessClientDataUseCase implements UseCase<ProcessClientDataInputDTO, void> {
  async execute(input: ProcessClientDataInputDTO): Promise<void> {
    // Simulando o processamento de dados do cliente
    console.log('Processing client data:', input.email)
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Client data processed successfully:', input.email)
  }
}
